const nodemailer = require('nodemailer');
const { email, password } = process.env;


module.exports.sendMail = async (content) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password,
        }
    });

    const mailOptions = {
        from: 'varazdat.manukyan@click2sure.co.za',
        to: 'varazdat.manukyan@click2sure.co.za, haykohanyans@gmail.com',
        subject: 'New data available',
        text: 'See screenshot attached.',
        attachments: {
            filename: 'screenshot.png',
            content,
            cid: '63f28392-6aaf-11eb-9439-0242ac130002-futures-scrap-ho' // should be as unique as possible
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