const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    // Existing fields...
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['General', 'Creator', 'Admin'],
        default: 'General'
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false
    },
    updates: {
        type: Boolean,
        default: false
    },
    screenName: {
        type: String
    },
    uiLanguage: {
        type: String
    },
    preferredLanguage: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    countryOfResidence: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    seniorityStatus: {
        type: String,
        enum: ['Expert', 'Novice']
    },
    gender: {
        type: String
    },
    highestEducation: {
        type: String
    },
    brainDominance: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    profilePicture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'uploads.files'
    },
    membershipType: {
        type: String,
        enum: ['free', 'monthly', 'yearly'],
        default: 'free'
    },
    membershipExpiryDate: {
        type: Date
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('User', UserSchema);


 
module.exports = mongoose.model('User', UserSchema);
