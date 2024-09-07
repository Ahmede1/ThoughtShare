const authService = require('../services/authService');
const config = require('config');
// Controller function to handle user registration
const register = async (req, res) => {
    const { email, updates, termsAccepted } = req.body;
    try {
        const response = await authService.register(email, updates, termsAccepted);
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to handle email confirmation
const confirmEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const tokens = await authService.confirmEmail(token);
        // Redirect to the specified  
        // res.redirect(`${config.get('ANGULAR_SERVER_HOST')}/authentication/complete-profile?userId=${tokens.userId}`);
        res.status(200).json(tokens);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to handle user login
const login = async (req, res) => {
    const { email, password } = req.body; 
    try {
        const tokens = await authService.login(email, password);
        res.status(200).json(tokens);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to handle user logout
const logout = async (req, res) => {
    try {
        const userId = req.user.id;
        await authService.logout(userId);
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging out user' });
    }
};

// Controller function to handle token refresh
const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const tokens = await authService.refreshAccessToken(refreshToken);
        res.status(200).json(tokens);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to handle initiating password reset
const initiatePasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const response = await authService.initiatePasswordReset(email);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to handle password reset
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const response = await authService.resetPassword(token, newPassword);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to complete profile
const completeProfile = async (req, res) => {
    const { userId, profileData } = req.body;

    try {
        const response = await authService.completeProfile(userId, profileData);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const profileData = req.body;
    try {
        const response = await authService.updateProfile(userId, profileData);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};




const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await authService.uploadProfilePicture(userId, req.file);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function to get user data
const getUserData = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await authService.getUserData(userId);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    register,
    confirmEmail,
    login,
    refreshAccessToken,
    initiatePasswordReset,
    resetPassword,
    completeProfile,
    updateProfile,
    logout,
    uploadProfilePicture,
    getUserData,
};
