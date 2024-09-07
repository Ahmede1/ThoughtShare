const userService = require('../services/userService');

// Controller function for toggling follow/unfollow user
const toggleFollowings = async (req, res) => {
    try {
        const { id: targetUserId, action } = req.body;
        const userId = req.user.id;  // Authenticated user

        if (!['follow', 'unfollow'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action' });
        }

        const updatedUser = await userService.toggleFollowUser(userId, targetUserId, action);

        res.status(200).json({
            message: `User ${action}ed successfully`,
            followersCount: updatedUser.followers.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Controller function for getting the cumulative rating of a creator
const getCumulativeRating = async (req, res) => {
    try {
        const creatorId = req.params.id;

        const { averageRating, totalRatings } = await userService.getCumulativeRatingForCreator(creatorId);

        res.status(200).json({
            creatorId,
            averageRating,
            totalRatings
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    toggleFollowings,getCumulativeRating
};
