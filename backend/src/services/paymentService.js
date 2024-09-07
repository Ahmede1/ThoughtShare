const PaymentLogs = require('../models/PaymentLogs');
const User = require('../models/User');
const mongoose = require('mongoose');

const purchaseMembership = async (userId, membershipType, amount, currency) => {
    // Generate a random status with 90% true and 10% false probability
    const status = Math.random() < 0.6;

    // Create a new payment log entry
    const paymentLog = new PaymentLogs({
        userId: mongoose.Types.ObjectId(userId),
        membershipType,
        amount,
        currency,
        status
    });

    // Save the payment log to the database
    await paymentLog.save();

    // If the payment is successful, update the user's membership details
    if (status) {
        const user = await User.findById(userId);

        if (membershipType === 'monthly') {
            user.membershipExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        } else if (membershipType === 'yearly') {
            user.membershipExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 365 days from now
        }

        user.membershipType = membershipType;

        await user.save();
    }

    return paymentLog;
};

module.exports = { purchaseMembership };
