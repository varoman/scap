const nodemailer = require('nodemailer');
const { email, emails_to, password } = process.env;


module.exports.sendMail = async (content) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password,
        }
    });

    const mailOptions = {
        from: email,
        to: emails_to,
        subject: 'New data available',
        text: 'See screenshot attached.',
        attachments: {
            filename: 'screenshot.png',
            content,
            cid: '63f28392-6aaf-11eb-9439-0242ac130002-futures-scrap-ho',
        }
    };

    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
