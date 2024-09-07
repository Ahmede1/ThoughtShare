const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/authMiddleware');

// Route for purchasing membership
router.post('/purchase-membership', auth, paymentController.purchaseMembership);

module.exports = router;
