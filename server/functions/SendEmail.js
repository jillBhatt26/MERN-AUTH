const nodemailer = require('nodemailer');

const SendEmail = options => {
    const transporter = nodemailer.createTransport({
        name: process.env.EMAIL_NAME,
        host: process.env.EMAIL_HOST,
        sendMail: true,
        port: process.env.EMAIL_PORT,
        secure: true, // use SSL
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text
    };

    transporter.sendMail(mailOptions);
};

module.exports = SendEmail;
