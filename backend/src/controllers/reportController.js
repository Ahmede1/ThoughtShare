const reportService = require('../services/reportService');

// Controller function for reporting inappropriate content
const reportContent = async (req, res) => {
    try {
        const { videoId, reason, timestamp, details } = req.body;
        const userId = req.user.id; // Authenticated user

        const report = await reportService.reportInappropriateContent(userId, videoId, reason, timestamp, details);

        res.status(200).json({
            message: 'Report submitted successfully',
            reportId: report._id
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    reportContent
};
