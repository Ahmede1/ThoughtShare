const express = require('express');
const videoController = require('../controllers/videoController');
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');
const { uploadImageService, uploadVideoService } = require('../services/gridFSService'); // Import GridFS service for image and video uploads
const { getUserVideos } = require('../services/videoService');
const router = express.Router();

router.get('/trending', videoController.getTrendingVideos);


// Route for getting all videos
router.get('/my-videos', auth,videoController.getUserVideos);
router.get('/', auth,videoController.getUserVideos);

// Route for searching videos
router.post('/search', videoController.searchVideos);


router.get('/:id', videoController.getVideoById);

// Route for uploading a new video (protected, creator only)
// router.post('/upload-video', auth, uploadImageService.single('thumbnail'), videoController.uploadVideo);
router.post('/upload-video', auth, uploadImageService.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), videoController.uploadVideo);

// router.post('/upload-video', auth, , uploadVideoService.single('video'), videoController.uploadVideo);
// router.post('/upload-video', auth, uploadImageService.fields([{ name: 'thumbnail', maxCount: 1 }]), uploadVideoService.single('video'), videoController.uploadVideo);

// Route for requesting video deletion (protected)
router.post('/request-video-deletion', auth, videoController.requestVideoDeletion);

// Route for deleting a video by ID (protected, admin only)
router.delete('/delete-video/:id', auth, admin, videoController.deleteVideoById);


// Route to toggle upvote/downvote on a video
router.post('/toggleVoting', auth, videoController.toggleVoting);

// Route to remove voting on a video
router.delete('/:id/removeVoting', auth, videoController.removeVoting);

// Route to rate a video and optionally add a review
router.post('/rate', auth, videoController.rateVideo);



const Video = require('../models/Video'); 

// Middleware to check if the user is the creator or an admin
const checkPermissions = async (req, res, next) => {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
        return res.status(404).json({ message: 'Video not found' });
    }

    const isAdmin = req.user.role === 'Admin';
    const isCreator = video.creator.toString() === req.user.id;

    if (!isAdmin && !isCreator) {
        return res.status(403).json({ message: 'Access denied' });
    }

    next();
};

// Route to get video statistics
router.get('/:videoId/statistics', auth, checkPermissions, videoController.getVideoStatistics);



router.get('/:videoId/get-ratings', videoController.getRatingsByVideoId);

 

module.exports = router;
