const User = require('../models/User');
const Video = require('../models/Video');
const Ratings = require('../models/Ratings');

// Service function to get the cumulative rating for a creator
const getCumulativeRatingForCreator = async (creatorId) => {
    // Find all videos by the creator
    const videos = await Video.find({ creator: creatorId });

    // Collect all ratings for these videos
    const ratings = await Ratings.find({ videoId: { $in: videos.map(video => video._id) } });

    

    if (ratings.length === 0) {
        return { averageRating: 0, totalRatings: 0 };
    }

    // Calculate the cumulative rating
    const totalRatings = ratings.length;
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    return { averageRating, totalRatings };
};
 


// Service function to follow or unfollow a user
const toggleFollowUser = async (userId, targetUserId, action) => {
    const user = await User.findById(targetUserId);

    if (!user) {
        throw new Error('Target user not found');
    }

    if (action === 'follow') {
        // Add userId to the followers array if not already followed
        if (!user.followers.includes(userId)) {
            user.followers.push(userId);
        }
    } else if (action === 'unfollow') {
        // Remove userId from the followers array
        user.followers = user.followers.filter(followerId => followerId.toString() !== userId.toString());
    }

    await user.save();
    return user;
};

module.exports = {
    toggleFollowUser,getCumulativeRatingForCreator
};
