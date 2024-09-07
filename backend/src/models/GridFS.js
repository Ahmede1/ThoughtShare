const mongoose = require('mongoose');

// Define the schema for the files collection
const GridFileSchema = new mongoose.Schema({}, { strict: false });

const ImageFile = mongoose.model('images.files', GridFileSchema);
const VideoFile = mongoose.model('videos.files', GridFileSchema);

module.exports = { ImageFile, VideoFile };
