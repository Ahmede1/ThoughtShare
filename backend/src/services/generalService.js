const { sendEmail } = require('../utils/emailUtils');

const sendSupportEmail = async (email, body) => {
    const user = { email };
    const subject = 'Support Email';

    // tuue means send to admin
    await sendEmail(user, subject, body,true);
    return { message: 'Email sent successfully' };
};

module.exports = { sendSupportEmail };
