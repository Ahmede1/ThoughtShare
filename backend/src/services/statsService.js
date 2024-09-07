const Log = require('../models/Log');

const getStats = async () => {
    // Fetch login and logout events from the Log model
    const loginEvents = await Log.find({ activity: 'login' });
    const logoutEvents = await Log.find({ activity: 'logout' });

    // Hardcoded statistics for other activities
    const hardcodedStats = {
        videoSearchRequests: [
            { timestamp: '2024-07-20T12:00:00Z', searchParameters: 'example search' },
        ],
        videoStreamingStart: [
            { timestamp: '2024-07-20T12:05:00Z', videoId: 'video123' },
        ],
        videoStreamingEnd: [
            { timestamp: '2024-07-20T12:10:00Z', videoId: 'video123' },
        ],
        reviewSubmissions: [
            { timestamp: '2024-07-20T12:15:00Z', reviewId: 'review456' },
        ],
        userFollows: [
            { timestamp: '2024-07-20T12:20:00Z', followedUserId: 'user789' },
        ],
        userUnfollows: [
            { timestamp: '2024-07-20T12:25:00Z', unfollowedUserId: 'user789' },
        ],
        videoVotes: [
            { timestamp: '2024-07-20T12:30:00Z', videoId: 'video123', vote: 'up' },
            { timestamp: '2024-07-20T12:35:00Z', videoId: 'video123', vote: 'down' },
        ],
        creatorVotes: [
            { timestamp: '2024-07-20T12:40:00Z', creatorId: 'creator123', vote: 'up' },
            { timestamp: '2024-07-20T12:45:00Z', creatorId: 'creator123', vote: 'down' },
        ],
        videoUploads: [
            { timestamp: '2024-07-20T12:50:00Z', videoId: 'video789' },
        ],
        newSubscriptions: [
            { timestamp: '2024-07-20T12:55:00Z', paymentInfo: 'payment123' },
        ],
    };

    return {
        loginEvents,
        logoutEvents,
        ...hardcodedStats,
    };
};

module.exports = { getStats };
