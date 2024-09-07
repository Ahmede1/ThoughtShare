const Log = require('../models/Log');

// Service function to log an activity
const logActivity = async (userId, activity, details = {}) => {

    console.log(userId, activity, details)
    const log = new Log({ userId, activity, details });
    await log.save();
    return log;
};

module.exports = { logActivity };
