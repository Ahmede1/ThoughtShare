const Video = require('../models/Video');
const User = require('../models/User');
const Tag = require('../models/Tag');
const Ratings = require('../models/Ratings'); // Make sure to import the Ratings model

const VideoDeleteRequest = require('../models/VideoDeleteRequest');
const { sendEmail } = require('../utils/emailUtils');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const config = require('config');
const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');
const fs = require('fs');
const streamBuffers = require('stream-buffers');
const logService = require('./logService');
const Log = require('../models/Log');



const BASE_URL = config.get('BASE_URL');
const mongoURI = config.get('DB_URI');
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let gfsImagesBucket;
let gfsVideosBucket;
conn.once('open', () => {
    gfsImagesBucket = new GridFSBucket(conn.db, {
        bucketName: 'images'
    });
    gfsVideosBucket = new GridFSBucket(conn.db, {
        bucketName: 'videos'
    });
});

const getUserVideos = async (userId) => {
    const videos = await Video.find({ creator: userId })
        .populate('creator', 'screenName')
        .populate('mandatoryTags', 'name category')
        .populate('optionalTags', 'name category')
        .select('-__v'); // Exclude the __v field if you don't need it

    return await Promise.all(videos.map(async (video) => {
        const videoObject = video.toObject();
        videoObject.thumbnail = videoObject.thumbnail ? `${BASE_URL}/image/${videoObject.thumbnail}` : null;
        videoObject.video = videoObject.video ? `${BASE_URL}/video/${videoObject.video}` : null;
        videoObject.ratings = await getRatingsByVideoId(videoObject._id);
        var ratings = await getRatingsByVideoId(videoObject._id);
        videoObject.rating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length : 0;

        return videoObject;
    }));
};

// const getRatingsByVideoId = async (videoId,addUserDetails=null) => {
//     const ratings = await Ratings.find({ videoId: videoId });
//     if(addUserDetails){

//     }
//     return ratings;
// };

const getRatingsByVideoId = async (videoId, addUserDetails = null) => {
    const ratings = await Ratings.find({ videoId: videoId });
    // console.log(ratings)
    if (addUserDetails) {
        return await Promise.all(ratings.map(async (rating) => {
            const user = await User.findById(rating.userId).select('screenName profilePicture');
            return {
                ...rating.toObject(),
                user: {
                    screenName: user.screenName,
                    profilePicture: user.profilePicture ? `${BASE_URL}/image/${user.profilePicture}` : null
                }
            };
        }));
    }

    return ratings;
};



const getVideoById = async (videoId, user = null) => {
    const video = await Video.findById(videoId)
        .populate({
            path: 'creator',
            select: 'screenName followers',
            populate: {
                path: 'followers',
                select: '_id'
            }
        })
        .populate('mandatoryTags', 'name category')
        .populate('optionalTags', 'name category')
        .select('-__v'); // Exclude the __v field if you don't need it

    if (!video) {
        throw new Error('Video not found');
    }

    const videoObject = video.toObject();
    videoObject.ratings = await getRatingsByVideoId(videoObject._id)
    videoObject.rating = videoObject.ratings.length > 0 ? videoObject.ratings.reduce((sum, rating) => sum + rating.rating, 0) / videoObject.ratings.length : 0;


    videoObject.thumbnail = videoObject.thumbnail ? `${BASE_URL}/image/${videoObject.thumbnail}` : null;
    videoObject.video = videoObject.video ? `${BASE_URL}/video/${videoObject.video}` : null;

    videoObject.totalUpVotes = videoObject.upvotes.length
    videoObject.totalDownVotes = videoObject.downvotes.length


    // Check if the user is logged in and log the activity
    if (user) {
        await logService.logActivity(user.id, 'video_stream_start', { videoId });
        videoObject.voteStatus = videoObject.upvotes.some(upvoteId => upvoteId.toString() === user.id.toString()) ? 'upvote' : videoObject.downvotes.some(downvoteId => downvoteId.toString() === user.id.toString()) ? 'downvote' : null;

        videoObject.hasRated = videoObject.ratings.some(rating => rating.userId.toString() === user.id.toString());
        // videoObject.isFollowingAuthor = videoObject.creator.followers ? videoObject.creator.followers.some(followerId => followerId.toString() === user.id.toString()) : false;
        videoObject.isFollowingAuthor = videoObject.creator.followers.some(follower => {
            return follower._id.toString() === user.id.toString()
        });
    }

    delete videoObject.ratings
    return videoObject;
};





const extractThumbnail = (videoStream) => {
    return new Promise((resolve, reject) => {
        const passThroughStream = new PassThrough();
        const outputStreamBuffer = new streamBuffers.WritableStreamBuffer({
            initialSize: (100 * 1024),   // start as 100 kilobytes.
            incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
        });

        videoStream.pipe(passThroughStream);

        ffmpeg(passThroughStream)
            .on('end', () => {
                const thumbnailBuffer = outputStreamBuffer.getContents();
                resolve(thumbnailBuffer);
            })
            .on('error', reject)
            .screenshots({
                count: 1,
                timemarks: ['10'], // Capture a frame at 10 seconds
                size: '320x240'
            })
            .output(outputStreamBuffer);
    });
};


const uploadVideo = async (creator, title, description, language, mandatoryTags, optionalTags, thumbnailFile, videoFile, year = null) => {
    let thumbnailId = null;
    let videoId = videoFile.id;

    if (thumbnailFile) {
        thumbnailId = thumbnailFile.id;
    }

    // Convert mandatoryTags and optionalTags to ObjectId arrays
    mandatoryTags = JSON.parse(mandatoryTags).map(tag => mongoose.Types.ObjectId(tag));
    optionalTags = optionalTags ? JSON.parse(optionalTags).map(tag => mongoose.Types.ObjectId(tag)) : [];

    const video = new Video({
        creator,
        title,
        description,
        language,
        mandatoryTags,
        optionalTags,
        thumbnail: thumbnailId,
        video: videoId
    });

    const savedVideo = await video.save();

    // Create a JavaScript object copy of the saved video and add modified data
    const videoObject = {
        ...savedVideo.toObject(),
        thumbnail: savedVideo.thumbnail ? `${BASE_URL}/image/${savedVideo.thumbnail}` : null,
        video: savedVideo.video ? `${BASE_URL}/video/${savedVideo.video}` : null
    };

    return videoObject;
};


const searchVideos = async (searchPhrase, tags, year, language,authors) => {
    const searchRegex = new RegExp(searchPhrase, 'i');
    const query = {
        $or: [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } }
        ]
    };

    if (tags && tags.length > 0) {
        const tagQuery = await Tag.find({ name: { $in: tags } }).select('_id');
        const tagIds = tagQuery.map(tag => tag._id);

        query.$or.push(
            { mandatoryTags: { $in: tagIds } },
            { optionalTags: { $in: tagIds } }
        );
    }

    if (year) {
        query.year = year;
    }

    if (language) {
        query.language = language;
    }

    if (authors && authors.length > 0) {
        query.creator = { $in: authors };
    }

    const videos = await Video.find(query)
        .populate('creator', 'screenName')
        .populate('mandatoryTags', 'name category')
        .populate('optionalTags', 'name category')
        .select('-__v'); // Exclude the __v field if you don't need it

        const sortedVideos = await Promise.all(videos.sort((a, b) => {
            const aTitleMatch = searchRegex.test(a.title);
            const bTitleMatch = searchRegex.test(b.title);
            if (aTitleMatch && !bTitleMatch) return -1;
            if (!aTitleMatch && bTitleMatch) return 1;
            return 0;
        }).map(async (video) => {
            const videoObject = video.toObject();
            videoObject.thumbnail = videoObject.thumbnail ? `${BASE_URL}/image/${videoObject.thumbnail}` : null;
            videoObject.video = videoObject.video ? `${BASE_URL}/video/${videoObject.video}` : null;
        
            // Calculate average rating
            const ratings = await getRatingsByVideoId(videoObject._id);
            videoObject.rating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length : 0;
        
            return videoObject;
        }));
        

 

    return sortedVideos;
};




const requestVideoDeletion = async (videoId, description, userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new Error('Video not found');
    }

    video.deletionRequested = true;
    await video.save();

    const deleteRequest = new VideoDeleteRequest({
        video: videoId,
        description
    });

    await deleteRequest.save();

    const subject = 'Video Deletion Request';
    const body = `
        <p>User ${user.screenName} has requested to delete the following video:</p>
        <p>Video ID: ${videoId}</p>
        <p>Description: ${description}</p>
    `;


    // true means toAdmin = true
    //await sendEmail(user, subject, body, true);

    return { message: 'Video deletion request submitted successfully' };
};

const deleteVideoById = async (videoId) => {
    const video = await Video.findById(videoId);
    if (!video) {
        throw new Error('Video not found');
    }

    // Delete the video file from GridFS if it exists
    if (video.video) {
        await gfsVideosBucket.delete(mongoose.Types.ObjectId(video.video));
    }

    // Delete the thumbnail from GridFS if it exists
    if (video.thumbnail) {
        await gfsImagesBucket.delete(mongoose.Types.ObjectId(video.thumbnail));
    }

    // Delete the video from the database
    await Video.findByIdAndDelete(videoId);

    return { message: 'Video and its thumbnail deleted successfully' };
};

// Service function to toggle upvote or downvote on a video
const toggleVote = async (userId, videoId, action) => {
    const video = await Video.findById(videoId);

    if (!video) {
        throw new Error('Video not found');
    }

    // Remove user from both upvotes and downvotes arrays first
    video.upvotes = video.upvotes.filter(upvoteId => upvoteId.toString() !== userId.toString());
    video.downvotes = video.downvotes.filter(downvoteId => downvoteId.toString() !== userId.toString());

    if (action === 'upvote') {
        video.upvotes.push(userId);
    } else if (action === 'downvote') {
        video.downvotes.push(userId);
    }

    // Ensure ratings are stored as ObjectIds
    video.ratings = video.ratings.map(rating => mongoose.Types.ObjectId(rating._id));

    await video.save();
    return video;
};

// Service function to delete voting (remove user from both upvotes and downvotes)
const deleteVoting = async (userId, videoId) => {
    const video = await Video.findById(videoId);

    if (!video) {
        throw new Error('Video not found');
    }

    video.upvotes = video.upvotes.filter(upvoteId => upvoteId.toString() !== userId.toString());
    video.downvotes = video.downvotes.filter(downvoteId => downvoteId.toString() !== userId.toString());

    await video.save();
    return video;
};



// Service function to rate a video and optionally add or update a review
const rateVideo = async (userId, videoId, rating, review = null) => {
    const video = await Video.findById(videoId);

    if (!video) {
        throw new Error('Video not found');
    }

    // Check if the user has already rated the video
    let existingRating = await Ratings.findOne({ userId, videoId });

    if (existingRating) {
        // Update the existing rating and review
        existingRating.rating = rating;
        existingRating.review = review;
        existingRating.timestamp = Date.now();
    } else {
        // Add a new rating and review
        existingRating = new Ratings({ userId, videoId, rating, review });
        await existingRating.save();

        // Push the new rating's ObjectId into the video's ratings array
        video.ratings.push(existingRating._id);
        await video.save();
    }

    await existingRating.save();
    console.log(existingRating)
    console.log(video)


    // Calculate the average rating
    const ratings = await Ratings.find({ videoId });
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    return { video, averageRating };
};



const getTrendingVideos = async () => {
    let videos = await Video.find()
    .populate('creator', 'screenName')
    .populate('mandatoryTags', 'name category')
    .populate('optionalTags', 'name category')
    .select('-__v') // Exclude the version key
    .lean(); // Use lean() for faster performance as we're just reading data

    // Calculate net votes and add to each video object
    videos = videos.map(video => {
        // Default to empty array if upvotes or downvotes are undefined
        const upvotes = video.upvotes || [];
        const downvotes = video.downvotes || [];
        video.netVotes = upvotes.length - downvotes.length;
        return video;
    });

    // Now sort videos based on netVotes
    videos.sort((a, b) => b.netVotes - a.netVotes);

    // Further process each video to include URLs and ratings
    const sortedVideos = await Promise.all(videos.slice(0, 10).map(async (video) => {
        video.thumbnail = video.thumbnail ? `${BASE_URL}/image/${video.thumbnail}` : null;
        video.video = video.video ? `${BASE_URL}/video/${video.video}` : null;
        
        // Calculate average rating
        const ratings = await getRatingsByVideoId(video._id);
        video.rating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length : 0;

        return video;
    }));

    return sortedVideos;
};





// Service function to calculate video statistics
const getVideoStatistics = async (videoId, period = 'lifetime') => {
    // videoId = mongoose.Types.ObjectId('66a683b2afe05217a4dc001a');
    // videoId = mongoose.Types.ObjectId(videoId);
    var video = await Video.findById(videoId); 

    const videoObject = video.toObject();
    const matchCriteria = { 'details.videoId': videoId };

    // if (userId) {
    //     // matchCriteria.userId = userId;
    // }
 
    // const activities = await Log.find({ 'details.videoId': videoId }).select('activity');
    // console.log(activities);
    


    const groupByPeriod = {
        'day': { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        'month': { $dateToString: { format: '%Y-%m', date: '$timestamp' } },
        'year': { $dateToString: { format: '%Y', date: '$timestamp' } },
        'lifetime': null
    };

    const periodGroup = groupByPeriod[period];

    const stats = await Log.aggregate([
        { $match: matchCriteria },
        {
            $group: {
                _id: periodGroup,
                videoStarted: { $sum: { $cond: [{ $eq: ['$activity', 'video_watch_start'] }, 1, 0] } },
                watched25: { $sum: { $cond: [{ $eq: ['$activity', 'video_watch_25'] }, 1, 0] } },
                watched50: { $sum: { $cond: [{ $eq: ['$activity', 'video_watch_50'] }, 1, 0] } },
                watched75: { $sum: { $cond: [{ $eq: ['$activity', 'video_watch_75'] }, 1, 0] } },
                watched100: { $sum: { $cond: [{ $eq: ['$activity', 'video_watch_100'] }, 1, 0] } },
            }
        }
    ]);


    // console.log(stats)
    // console.log(videoObject)
     
    return  {video: videoObject,stats: stats}
};





module.exports = { requestVideoDeletion,getTrendingVideos, getRatingsByVideoId, getUserVideos, getVideoById, searchVideos, uploadVideo, deleteVideoById, toggleVote, deleteVoting, rateVideo, getVideoStatistics };
