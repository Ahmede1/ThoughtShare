const Report = require('../models/Report');
const videoService = require('./videoService');
const { sendEmail } = require('../utils/emailUtils');

const reportInappropriateContent = async (userId, videoId, reason, timestamp, details = '') => {
    const video = await videoService.getVideoById(videoId);
    if (!video) {
        throw new Error('Video not found');
    }

    // Create a new report
    const report = new Report({
        videoId,
        userId,
        reason,
        timestamp,
        details
    });

    await report.save();

    // Compose the email content
    const subject = `Inappropriate Content Reported for Video: ${video.title}`;
    const content = `
        <p>A user has reported inappropriate content in the video titled "<strong>${video.title}</strong>".</p>
        <p><strong>Reported by:</strong> ${userId}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Approximate Time of Breach:</strong> ${timestamp}</p>
        <p><strong>Additional Details:</strong> ${details}</p>
        <p>Please review the video and take the necessary action.</p>
    `;

    // Send email to admin
    // await sendEmail({ email: process.env.ADMIN_EMAIL }, subject, content);

    return report;
};

module.exports = {
    reportInappropriateContent
};
