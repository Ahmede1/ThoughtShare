const mongoose = require('mongoose');


const VideoSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        default: null
    },
    mandatoryTags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    }],
    optionalTags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: false
    }],
    thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images.files'
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videos.files'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletionRequested: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ratings'
    }],
    

});

module.exports = mongoose.model('Video', VideoSchema);
