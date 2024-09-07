const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

// Route to toggle follow/unfollow a user
router.post('/toggleFollowings', auth, userController.toggleFollowings);

// Route to get cumulative rating for a creator
router.get('/:id/rating', userController.getCumulativeRating);


module.exports = router;
