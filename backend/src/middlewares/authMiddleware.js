const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT tokens
const auth = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if the Authorization header is present
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing. Please authenticate.' });
    }

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
 

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token
        const user = await User.findOne({ _id: decoded.user.id });

        // If no user is found, throw an error
        if (!user) {
            throw new Error();
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (err) {
        // Return an error response if authentication fails
        res.status(401).json({ message: 'Invalid token. Please authenticate.' });
    }
};

module.exports = auth;
