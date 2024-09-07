const express = require('express');
const { sendSupportEmail } = require('../controllers/generalController');
const router = express.Router();

// Route for sending a support email
router.post('/send-email', sendSupportEmail);

module.exports = router;
