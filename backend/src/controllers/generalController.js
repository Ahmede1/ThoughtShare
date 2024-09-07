const generalService = require('../services/generalService');

const sendSupportEmail = async (req, res) => {
    try {
        const { email, body } = req.body;
        const result = await generalService.sendSupportEmail(email, body);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { sendSupportEmail };
