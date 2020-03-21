const nodemailer = require("nodemailer");

const sendEmail = async function (options) {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    let message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: "<h1>Hello World<h1/>"
    };
    const info = await transporter.sendMail(message);
    console.log(info);
};

module.exports = sendEmail;
