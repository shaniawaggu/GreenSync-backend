const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "greensync.reminder@gmail.com",
    pass: process.env.EMAIL_PASS
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = { 
        from: process.env.EMAIL_USER, 
        to, 
        subject, 
        text 
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
  }
};

module.exports = sendEmail;
