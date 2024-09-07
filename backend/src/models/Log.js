const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    activity: {  
        type: String,
        required: true,
        enum: [
            'login',
            'logout',
            'video_search',
            'video_stream_start',
            'video_stream_end',
            'review_submit',
            'follow_user',
            'unfollow_user',
            'video_upvote',
            'video_downvote',
            'video_creator_upvote',
            'video_creator_downvote',
            'video_upload',
            'subscription_new',
            'browse_video',
            'video_watch_start',  // When a user starts watching a video
            'video_watch_25',     // Watched less than 25%
            'video_watch_50',     // Watched between 25% and 50%
            'video_watch_75',     // Watched between 50% and 75%
            'video_watch_100'     // Watched full length
        ]
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('Log', LogSchema);
