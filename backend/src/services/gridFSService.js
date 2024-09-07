const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const config = require('config'); // Assuming you are using config for environment variables

const mongoURI = config.get('DB_URI');

// Create a connection to the MongoDB instance
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Initialize GridFSBuckets for images and videos
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

// Create storage engine for images
const imageStorage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images' // Collection name in MongoDB
                };
                resolve(fileInfo);
            });
        });
    }
});

const uploadImageService = multer({ storage: imageStorage });

// Create storage engine for videos
const videoStorage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'videos' // Collection name in MongoDB
                };
                resolve(fileInfo);
            });
        });
    }
});

const uploadVideoService = multer({ storage: videoStorage });

// Function to serve the uploaded file
const fileRenderer = async (req, res) => {
    try {
        const { fileId, type } = req.params;

        // Dynamic checking which bucket to query from. Not working now
        // const gfsBucket = type === 'images' ? gfsImagesBucket : gfsVideosBucket;
        // const file = await conn.db.collection(`${type}.files`).findOne({ _id: mongoose.Types.ObjectId(fileId) });
        
        const gfsBucket = gfsImagesBucket ;
        const file = await conn.db.collection(`${'images'}.files`).findOne({ _id: mongoose.Types.ObjectId(fileId) });
        


        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const readstream = gfsBucket.openDownloadStream(mongoose.Types.ObjectId(fileId));
        res.set('Content-Type', file.contentType);
        return readstream.pipe(res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { uploadImageService, uploadVideoService, fileRenderer };
