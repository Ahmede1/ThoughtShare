const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const logService = require('./logService'); // Make sure to import the logService
const config = require('config');

const BASE_URL = config.get('BASE_URL'); // Assuming BASE_URL is set in your config


// Helper function to generate access and refresh tokens
const generateTokens = (user) => {
    const payload = { user: { id: user.id } };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });

    const accessExpiresIn = jwt.decode(accessToken).exp;
    const refreshExpiresIn = jwt.decode(refreshToken).exp;

    // return { accessToken, refreshToken, accessExpiresIn, refreshExpiresIn };
    return { accessToken, refreshToken, accessExpiresIn  };
};

// Helper function to load email template and replace placeholders
const loadTemplate = (content) => {
    const templatePath = path.join(__dirname, '../static/mailTemplate.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    const year = new Date().getFullYear();

    template = template.replace('{{PLATFORM_NAME}}', process.env.PLATFORM_NAME);
    template = template.replace('{{year}}', year);
    template = template.replace('INNER_CONTENT', content);

    return template;
};

// Helper function to send email
const sendEmail = async (user, subject, content) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const htmlContent = loadTemplate(content);

    const mailOptions = {
        from: process.env.DEFAULT_FROM_EMAIL,
        to: user.email,
        subject: subject,
        html: htmlContent,
        attachments: [{
            filename: 'logo.png',
            path: path.join(__dirname, '../static/images/logo.png'),
            cid: 'logo' // same cid value as in the html img src
        }]
    };

    await transporter.sendMail(mailOptions);
};

// Service function to register a new user
const register = async (email, updates, termsAccepted) => {
    if (!termsAccepted) {
        throw new Error('You must accept the terms and conditions to register.');
    }

    let user = await User.findOne({ email });
    if (user && user.isEmailConfirmed) {
        throw new Error('User already exists');
    }
    if (user && !user.isEmailConfirmed){

    }else{
        user = new User({ email, role: 'General', updates });
    }

    await user.save();

    // Generate email confirmation token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send confirmation email
    const content = `
        <p>Welcome to ${process.env.PLATFORM_NAME}!</p>
        <p>Please confirm your email by clicking the button below:</p>
        <a href="${config.get('ANGULAR_SERVER_HOST')}/authentication/confirm-email?token=${token}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Confirm Email</a>
    `;
    console.log(content)
    await sendEmail(user, 'Email Confirmation', content);

    return { message: 'Confirmation email sent. Please check your inbox.' };
};

const confirmEmail = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) {
        throw new Error('Invalid token');
    }

    user.isEmailConfirmed = true;
    await user.save();

    // Generate access and refresh tokens
    const tokens = generateTokens(user);

    return { userId: user.id, ...tokens };
};



// Service function to log in a user
const login = async (email, password) => { 
    
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    if (!user.isEmailConfirmed) {
        throw new Error('Please confirm your email to log in.');
    }

    // Log the login activity
    await logService.logActivity(user.id, 'login');

    // Generate access and refresh tokens
    const tokens = generateTokens(user);

    // Return tokens and user profile data

    // Check if the membership has expired
    if (user.membershipExpiryDate) {
        const currentDate = new Date();
        const membershipExpiry = new Date(user.membershipExpiryDate); 
        var allowPremiumContent = membershipExpiry > currentDate;
    } else {
        // If membershipExpiry does not exist, you can set allowPremiumContent to false or handle it as per your requirement
        var allowPremiumContent = false;
    }


    return {
        tokens,
        user: {
            id: user.id,
            email: user.email,
            screenName: user.screenName,
            uiLanguage: user.uiLanguage,
            preferredLanguage: user.preferredLanguage,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            countryOfResidence: user.countryOfResidence,
            dateOfBirth: user.dateOfBirth,
            seniorityStatus: user.seniorityStatus,
            gender: user.gender,
            highestEducation: user.highestEducation,
            brainDominance: user.brainDominance, 
            profilePicture:  user.profilePicture ? `${BASE_URL}/image/${user.profilePicture} ` : null,
            allowPremiumContent : allowPremiumContent
        }
    };
};



// Service function to log out a user
const logout = async (userId) => {
    // Log the logout activity
    await logService.logActivity(userId, 'logout');
};


const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user) {
            throw new Error('User not found');
        }
        const tokens = generateTokens(user);
        return tokens;
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
};



// Service function to initiate password reset
const initiatePasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('No user found with that email');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const content = `
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${config.get('ANGULAR_SERVER_HOST')}/authentication/reset-password?token=${resetToken}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Reset Password</a>
    `;
    await sendEmail(user, 'Password Reset', content);

    return { message: 'Password reset email sent. Please check your inbox.' };
};

// Service function to reset password
const resetPassword = async (token, newPassword) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error('Password reset token is invalid or has expired');
    }
 
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password has been reset successfully' };
};

// Service function to complete profile
const completeProfile = async (userId, profileData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const {
        role,
        screenName,
        uiLanguage,
        preferredLanguage,
        firstName,
        lastName,
        countryOfResidence,
        dateOfBirth,
        seniorityStatus,
        gender,
        highestEducation,
        brainDominance,
        password
    } = profileData;

    user.role = role || user.role;
    user.screenName = screenName || user.screenName;
    user.uiLanguage = uiLanguage || user.uiLanguage;
    user.preferredLanguage = preferredLanguage || user.preferredLanguage;

    if (user.role === 'Creator') {
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.countryOfResidence = countryOfResidence || user.countryOfResidence;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.seniorityStatus = seniorityStatus || user.seniorityStatus;
    }

    user.gender = gender || user.gender;
    user.highestEducation = highestEducation || user.highestEducation;
    user.brainDominance = brainDominance || user.brainDominance;

    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return { message: 'Profile completed successfully' };
};

// Service function to update profile
const updateProfile = async (userId, profileData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const {
        email,
        role,
        screenName,
        uiLanguage,
        preferredLanguage,
        firstName,
        lastName,
        countryOfResidence,
        dateOfBirth,
        seniorityStatus,
        gender,
        highestEducation,
        brainDominance,
        password
    } = profileData;

    let emailChanged = false;
    if (email && email !== user.email) {
        user.email = email;
        user.isEmailConfirmed = false; // Reset email confirmation
        emailChanged = true;
    }

    if (role) {
        user.role = role;
    }

    user.screenName = screenName || user.screenName;
    user.uiLanguage = uiLanguage || user.uiLanguage;
    user.preferredLanguage = preferredLanguage || user.preferredLanguage;

    if (user.role === 'Creator') {
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.countryOfResidence = countryOfResidence || user.countryOfResidence;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.seniorityStatus = seniorityStatus || user.seniorityStatus;
    }

    user.gender = gender || user.gender;
    user.highestEducation = highestEducation || user.highestEducation;
    user.brainDominance = brainDominance || user.brainDominance;

    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    console.log("password = ",password)
    console.log("password = ",user.password)


    if (emailChanged) {
        // Generate email confirmation token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
 
        // Send confirmation email
        const content = `
            <p>Your email address has been changed. Please confirm your new email by clicking the button below:</p>
            <a href="${config.get('ANGULAR_SERVER_HOST')}/authentication/confirm-email?token=${token}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Confirm Email</a>
        `;
        await sendEmail(user, 'Email Confirmation', content);

        return { message: 'Profile updated successfully. Confirmation email sent to new address.' };
    }

    return { message: 'Profile updated successfully.' };
};


const Grid = require('gridfs-stream');
const mongoose = require('mongoose'); 
const { GridFSBucket } = require('mongodb');

const mongoURI = require('config').get('DB_URI');
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let gfsBucket;
conn.once('open', () => {
    gfsBucket = new GridFSBucket(conn.db, {
        bucketName: 'images'
    });
});

const uploadProfilePicture = async (userId, file) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if the user already has a profile picture
    if (user.profilePicture) {
        // Find and delete the old profile picture from GridFS
        const oldFile = await conn.db.collection('images.files').findOne({ _id: mongoose.Types.ObjectId(user.profilePicture) });
        if (oldFile) {
            await gfsBucket.delete(mongoose.Types.ObjectId(oldFile._id));
            console.log(`Deleted old profile picture ${oldFile._id}`);
        }
    }

    // Save the new file ID to the user's profile
    user.profilePicture = file.id;
    await user.save();

    
    return {
        message: 'Profile picture uploaded successfully',
        url: user.profilePicture ? `${BASE_URL}/image/${user.profilePicture} ` : null
    };
};


// Function to get user data by ID
const getUserData = async (userId) => {
    const user = await User.findById(userId).select('-password'); // Exclude the password field
    if (!user) {
        throw new Error('User not found');
    }
    // Convert the Mongoose document to a plain JavaScript object
    const userObject = user.toObject();

    // Modify the profilePicture field
    userObject.profilePicture = userObject.profilePicture ?`${BASE_URL}/image/${userObject.profilePicture}`:null;
    
    // Check if the membership has expired
    if (userObject.membershipExpiryDate) {
        const currentDate = new Date();
        const membershipExpiry = new Date(userObject.membershipExpiryDate);
        var allowPremiumContent = membershipExpiry > currentDate;
    } else {
        // If membershipExpiry does not exist, you can set allowPremiumContent to false or handle it as per your requirement
        var allowPremiumContent = false;
    } 
    userObject.allowPremiumContent = allowPremiumContent;

     // Get the list of users the current user has followed
     const followedUsers = await User.find({ followers: { $in: [mongoose.Types.ObjectId(userId)] } }).select('id screenName'); 


    // Add followed users to the userObject
    userObject.followings = followedUsers;

    // Return the modified object
    return userObject;
};


module.exports = { register, confirmEmail, login, refreshAccessToken, initiatePasswordReset, resetPassword, completeProfile,updateProfile ,logout,uploadProfilePicture,getUserData};
