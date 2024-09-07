const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middlewares/authMiddleware');

// Route to report inappropriate content
router.post('/submitReport', auth, reportController.reportContent);

module.exports = router;
