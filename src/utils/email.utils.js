const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const auth = {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
}

const sendAccountVerificationEmail = (email, url) => {
    return new Promise(async (resolve, rejects) => {
        try {

            let mailerConfig = {
                service: 'gmail',
                auth: auth,
            };

            let transporter = nodemailer.createTransport(mailerConfig);
            const filePath = path.join(__dirname, '../email-templates/email-verification/index.html');
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);
            const replacements = {
                url: url,
            };
            const htmlToSend = template(replacements);
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Account Verification',
                html: htmlToSend,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    rejects(error);
                } else {
                    console.log(`email sent successfully ... ${info.response}`);
                    resolve({ msg: 'email sent successfully ... ' })
                }
            });

        } catch (error) {
            throw Error(error);
        }
    });
}

const sendForgetPasswordEmail = (email, url) => {
    return new Promise(async (resolve, rejects) => {
        try {

            let mailerConfig = {
                service: 'gmail',
                auth: auth,
            };

            let transporter = nodemailer.createTransport(mailerConfig);
            const filePath = path.join(__dirname, '../email-templates/forget-password/index.html');
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);
            const replacements = {
                url: url
            };
            const htmlToSend = template(replacements);
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Forgot Password',
                html: htmlToSend,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    rejects(error);
                } else {
                    resolve({ msg: 'email sent successfully ... ' })
                }
            });

        } catch (error) {
            throw Error(error);
        }
    });
}

module.exports = {
    sendAccountVerificationEmail,
    sendForgetPasswordEmail,
}