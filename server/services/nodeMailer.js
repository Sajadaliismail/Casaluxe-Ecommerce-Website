
const nodemailer = require('nodemailer');

const MAIL_SETTINGS = {
  service: 'gmail',
  host:'smtp.gmail.com',
  port:465,
  secure:true,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },

}
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

 const sendMail = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: 'Casaluxe - OTP',
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome to CASALUXE.</h2>
        <h4>Thank you for signing up ✔</h4>
        <p style="margin-bottom: 30px;">Please enter this email verification OTP</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
   </div>
    `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = sendMail