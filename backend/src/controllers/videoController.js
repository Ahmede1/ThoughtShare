const videoService = require('../services/videoService');
const jwt = require('jsonwebtoken');

// Controller function to get videos of the logged-in user
const getUserVideos = async (req, res) => {
    try {
        const userId = req.user.id;
        const videos = await videoService.getUserVideos(userId);
        res.status(200).json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function to get a video by ID
const getVideoById = async (req, res) => {
    try {
        const videoId = req.params.id;
        let user = null;
        // Check if the Authorization header is present
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user = decoded.user; // Assuming the token payload contains a `user` object with `id`
            } catch (err) {

            }
        }
        const video = await videoService.getVideoById(videoId, user);
        res.status(200).json(video);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Controller function to search for videos
const searchVideos = async (req, res) => {
    try {
        const { searchPhrase, tags, year, language,authors } = req.body; 
        const videos = await videoService.searchVideos(searchPhrase, tags, year, language,authors);
        res.status(200).json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Controller function to upload a new video
const uploadVideo = async (req, res) => {
    try {
        const { title, description, language, mandatoryTags, optionalTags, year } = req.body;
        const creator = req.user.id;
        const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
        const videoFile = req.files.video[0];

        console.log("-mandatoryTags = ", mandatoryTags)
        const video = await videoService.uploadVideo(creator, title, description, language, mandatoryTags, optionalTags, thumbnailFile, videoFile, year);
        res.status(201).json(video);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Controller function to handle video deletion requests
const requestVideoDeletion = async (req, res) => {
    try {
        const { videoId, description } = req.body;
        console.log("videoId = ", videoId)
        const userId = req.user.id;
        const result = await videoService.requestVideoDeletion(videoId, description, userId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function to delete a video by ID
const deleteVideoById = async (req, res) => {
    try {
        const videoId = req.params.id;
        const result = await videoService.deleteVideoById(videoId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Controller function for toggling upvote/downvote
const toggleVoting = async (req, res) => {
    try {
        const { videoId, action } = req.body;
        const userId = req.user.id;  // Authenticated user

        if (!['upvote', 'downvote'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action' });
        } 
        const updatedVideo = await videoService.toggleVote(userId, videoId, action);
        console.log("---")
        res.status(200).json({
            message: `Video ${action}d successfully`,
            upvotesCount: updatedVideo.upvotes.length,
            downvotesCount: updatedVideo.downvotes.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function for deleting voting
const removeVoting = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;  // Authenticated user

        const updatedVideo = await videoService.deleteVoting(userId, videoId);

        res.status(200).json({
            message: 'Voting removed successfully',
            upvotesCount: updatedVideo.upvotes.length,
            downvotesCount: updatedVideo.downvotes.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function for rating a video and optionally adding a review
const rateVideo = async (req, res) => {
    try {
        const { videoId, rating, review } = req.body;
        const userId = req.user.id;  // Authenticated user

        const { video, averageRating } = await videoService.rateVideo(userId, videoId, rating, review);

        res.status(200).json({
            message: 'Video rated successfully',
            averageRating,
            ratingsCount: video.ratings.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Controller to get video statistics
const getVideoStatistics = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { period } = req.query; // period can be 'daily', 'monthly', 'yearly', 'lifetime'
        const userId = req.user?.id;  // Get the authenticated user's ID

        const stats = await videoService.getVideoStatistics(videoId, period || 'lifetime');

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to get video statistics
const getRatingsByVideoId = async (req, res) => {
    try {
        const { videoId } = req.params; 
        const userId = req.user?.id;  // Get the authenticated user's ID

        const stats = await videoService.getRatingsByVideoId(videoId,true);

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to get top videos
const getTrendingVideos = async (req, res) => {
    try { 
        const videos = await videoService.getTrendingVideos();

        res.status(200).json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { requestVideoDeletion,getTrendingVideos,getRatingsByVideoId, getUserVideos, searchVideos, getVideoById, uploadVideo, deleteVideoById, toggleVoting, removeVoting,rateVideo,getVideoStatistics };
