var nodemailer = require("nodemailer"); //importing node mailer
const dotenv = require('dotenv');
dotenv.config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const mailOptions = {
  from: process.env.EMAIL, // sender address
};

function sendMail(to, subject, text, callback) {
  transporter.sendMail({...mailOptions, to, subject: subject, text: text}, function(err, info) {
    if (err) console.log(err);
    else console.log(info);
    callback();
  });
}

module.exports = sendMail;