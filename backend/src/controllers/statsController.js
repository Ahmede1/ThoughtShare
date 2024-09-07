const statsService = require('../services/statsService');

const getStats = async (req, res) => {
    try {
        const stats = await statsService.getStats();
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

module.exports = { getStats };
