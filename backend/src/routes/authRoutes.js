const express = require('express');
// const { register, login, refreshAccessToken, confirmEmail, initiatePasswordReset, resetPassword, completeProfile, updateProfile } = require('../controllers/authController');
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const { logLogin, logLogout } = require('../controllers/logController');
 
const gridFSService = require('../services/gridFSService'); // Import GridFS storage configuration


const router = express.Router();

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for user logout (requires authentication)
router.get('/logout', auth, authController.logout);

// Route for token refresh
router.post('/refresh-token', authController.refreshAccessToken);

// Route for email confirmation
router.get('/confirm-email', authController.confirmEmail);

// Route for initiating password reset
router.post('/initiate-password-reset', authController.initiatePasswordReset);

// Route for completing password reset
router.post('/reset-password', authController.resetPassword);

// Route for completing profile
router.post('/complete-profile', authController.completeProfile);

// Route for updating profile (requires authentication)
router.post('/update-profile', auth, authController.updateProfile);

// Route for uploading profile picture
router.post('/upload-profile-picture', auth, gridFSService.uploadImageService.single('file'), authController.uploadProfilePicture);


// Route for getting user data by ID (protected)
router.get('/user-data', auth, authController.getUserData);


module.exports = router;
