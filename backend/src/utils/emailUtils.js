const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const config = require('config');

const loadTemplate = (content) => {
    const templatePath = path.join(__dirname, '../static/mailTemplate.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    const year = new Date().getFullYear();

    template = template.replace('{{PLATFORM_NAME}}', process.env.PLATFORM_NAME || 'Platform');
    template = template.replace('{{year}}', year);
    template = template.replace('INNER_CONTENT', content);

    return template;
};

// Helper function to send email
// Helper function to send email
const sendEmail = async (user, subject="", content="",toAdmin=false) => {
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
        to: toAdmin ? process.env.ADMIN_EMAIL : user.email ,
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

module.exports = { sendEmail };
