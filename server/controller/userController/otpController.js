const { user, OTPschema } = require("../../models/userSchema");
const sendMail = require("../../services/nodeMailer");
const generateOTP = require("../../services/otpGenerator");

const checkEmail = async (req, res) => {
  try {
    const emailCheck = await user.findOne({ email: req.body.email });

    if (emailCheck !== null) {
      const otpUser = generateOTP();
      const email = req.body.email;

      await sendMail({
        to: email,
        OTP: otpUser,
      });

      const findOTP = await OTPschema.findOne({ email: email });

      if (findOTP !== null) {
        await OTPschema.findOneAndUpdate({ email: email }, { otp: otpUser });
      } else {
        const otp = new OTPschema({
          email: email,
          otp: otpUser,
        });
        await otp.save();
      }

      res.json({ success: true, message: "Email sent successfully" });
    } else {
      res.json({ success: false, error: "Email not registered" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const sendOtpEmail = async (req, res) => {
  try {
    const otpUser = generateOTP();
    const email = req.body.email;
console.log(otpUser)
    await sendMail({
      to: email,
      OTP: otpUser,
    });

    const findOTP = await OTPschema.findOne({ email: email });

    if (findOTP !== null) {
      await OTPschema.findOneAndUpdate({ email: email }, { otp: otpUser });
    } else {
      const otp = new OTPschema({
        email: email,
        otp: otpUser,
      });
      await otp.save();
    }

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const verifyOtpEmail = async (req, res) => {
  try {
    const userOtp = req.body.otp;
    const email = req.body.email;
    const findOtp = await OTPschema.findOne({ email: email });

    if (userOtp === findOtp.otp) {
      req.session.emailVerify = true;
      res.json({ message: "OTP verified", success: true });
    } else {
      res.json({ message: "Invalid OTP", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  checkEmail,
  sendOtpEmail,
  verifyOtpEmail,
};
