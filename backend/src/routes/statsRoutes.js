const express = require('express');
const { getStats } = require('../controllers/statsController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to get stats (requires authentication)
router.get('/accounting', auth, getStats);

module.exports = router;
