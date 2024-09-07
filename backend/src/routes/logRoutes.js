const express = require('express');
const router = express.Router();
const  logController = require('../controllers/logController');
const { auth } = require('../middlewares/authMiddleware');

// Endpoint to submit an activity log
router.post('/log-activity' , logController.submitActivityLog);

module.exports = router;
