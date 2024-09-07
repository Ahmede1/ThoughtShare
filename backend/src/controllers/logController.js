const logService = require('../services/logService');

// Controller function to log login activity
const logLogin = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await logService.logActivity(userId, 'login');
        next();
    } catch (err) {
        res.status(500).json({ message: 'Error logging login activity' });
    }
};

// Controller function to log login activity
const submitActivityLog = async (req, res, next) => {
    try { 
        const { userId,activity, details={} } = req.body; 
        var result = await logService.logActivity(userId, activity, details);
        res.status(200).json(result);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error logging activity' });
    }
};

// Middleware function to log logout activity
const logLogout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await logService.logActivity(userId, 'logout');
        next();
    } catch (err) {
        res.status(500).json({ message: 'Error logging logout activity' });
    }
};

module.exports = { logLogin, logLogout,submitActivityLog };
