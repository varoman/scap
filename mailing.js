const nodemailer = require('nodemailer');
const { email, password } = process.env;


module.exports.send = async (content) => {

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
        subject: 'New data',
        text: 'New screenshot attached.',
        attachments: {
            filename: 'screenshot.png',
            content,
            cid: 'varazdatmanukyanscrap' // should be as unique as possible
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
