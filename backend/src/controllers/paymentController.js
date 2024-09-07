const paymentService = require('../services/paymentService');

// Controller function for purchaseMembership
const purchaseMembership = async (req, res) => {
    try {
        const { membershipType, amount, currency } = req.body;
        const userId = req.user.id;  // Extracted from auth middleware

        const paymentLog = await paymentService.purchaseMembership(userId, membershipType, amount, currency);

        res.status(200).json(paymentLog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { purchaseMembership };
