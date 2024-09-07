const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String, // Content will be stored as HTML
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images.files',
        required: false
    }
});

module.exports = mongoose.model('News', NewsSchema);
