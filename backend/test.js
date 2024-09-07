const mongoose = require('mongoose');
const Log = require('./src/models/Log'); // Make sure to adjust the path to where your Log model is located
const User = require('./src/models/User'); // Adjust the path for the User model
const bcrypt = require('bcryptjs');
const config = require('config');
const mongoURI = 'mongodb://localhost:27017/Video_Sharing_Platform'; // Replace with your MongoDB connection string

 
    
    

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
    createAdminUser();
}).catch(err => console.error('MongoDB connection error:', err));

async function createAdminUser() {
    try {
        const hashedPassword = await bcrypt.hash('creator', 10);
        const adminUser = new User({
            email: 'creator@gmail.com',
            password: hashedPassword,
            role: 'Creator',
            isEmailConfirmed: true,
            screenName: 'CreatorUser',
            uiLanguage: 'English',
            preferredLanguage: 'English',
            firstName: 'Admin',
            lastName: 'User',
            countryOfResidence: 'USA',
            dateOfBirth: new Date(1980, 1, 1),
            seniorityStatus: 'Expert',
            gender: 'Other',
            highestEducation: 'PhD'
        });

        await adminUser.save();
        console.log('Admin user created successfully:', adminUser);
    } catch (err) {
        console.error('Error creating admin user:', err);
    } finally {
        mongoose.disconnect();
    }
}
