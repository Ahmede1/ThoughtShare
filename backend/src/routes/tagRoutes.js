const express = require('express');
const tagController= require('../controllers/tagController');
const auth = require('../middlewares/authMiddleware' )
const admin = require('../middlewares/adminMiddleware' )
const router = express.Router();

// Route for getting all tags
router.get('/', tagController.getAllTags);

// Route for inserting a new tag (protected, admin only)
router.post('/', auth, admin, tagController.insertTag);

module.exports = router;
