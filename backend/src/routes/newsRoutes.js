const express = require('express');
const newsController = require('../controllers/newsController');
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware'); // Middleware to check if the user is an admin
const gridFSService = require('../services/gridFSService'); // Import GridFS storage configuration

const router = express.Router();

// Route to get all news articles (accessible to everyone)
router.get('/', newsController.getAllNews);
 
// Route for creating news with a thumbnail (protected, admin only)
router.post('/', auth, admin, gridFSService.uploadImageService.single('thumbnail'), newsController.createNews);

// Route for deleting a news article by ID (protected, admin only)
router.delete('/:id', auth, admin, newsController.deleteNewsById);



module.exports = router;
