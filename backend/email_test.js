const nodemailer = require('nodemailer');

// Create a transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
  host: 'mail.hayfka.hu',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'mashood@hayfka.hu',
    pass: 'ws#yrMJmXm@s'
  }
});

// Define the email options
const mailOptions = {
  from: '"ThoughtShare" <mashood@hayfka.hu>', // sender address
  to: 'mashoodurrehmanofficial@gmail.com  ', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world?', // plain text body
  html: '<b>Hello world?</b>' // html body
};

// Send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});
