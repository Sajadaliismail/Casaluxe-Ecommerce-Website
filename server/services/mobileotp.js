// const OTP = () => {
//   return otpGenerator.generate(5, {
//     upperCaseAlphabets: false,
//     specialChars: false,
//     lowerCaseAlphabets: false,
//   });
// };

// const accountSid = "ACa52badcfa911e9a72fdf5d951cea165c";
// const authToken = "cc901676aada24335664ae16b597ed07";
// const twilioPhoneNumber = "+19045132853";

// const client = new twilio(accountSid, authToken);
// route.post("/send-otpphn",controller.sendotpphone);
// route.post("/verify-otpphn", controller.verifyotpphone);

// const accountSid = "ACa52badcfa911e9a72fdf5d951cea165c";
// const authToken = "cc901676aada24335664ae16b597ed07";
// const twilioPhoneNumber = "+19045132853";

// const client = new twilio(accountSid, authToken);

// exports.verifyotpphone =  async (req, res) => {
//   try {
//     const userOTP = req.body.otp;
//   if (userOTP === otpphone.otp) {
//     req.session.phoneverify = true;
//     res.json({ message: "OTP verified", success: true });
//   } else {
//     res.json({ message: "Invalid OTP", success: false });
//   }
//   } catch (error) {
//     res.render("User/page-error-404", { error: error.message });
//   }
// }
// exports.sendotpphone =  async (req, res) => {
//   const to = `+91${req.body.phone}`;
//   const otp = OTP();
//   otpphone.otp = otp;
//   await otpphone.save();
//   try {
//     const message = await client.messages.create({
//       body: `Your OTP is: ${otp}`,
//       from: twilioPhoneNumber,
//       to: to,
//     });
//     console.log(`OTP sent to ${to}: SID ${message.sid}`);
//     res.status(200).json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ error: "Error sending OTP" });
//   }
// }