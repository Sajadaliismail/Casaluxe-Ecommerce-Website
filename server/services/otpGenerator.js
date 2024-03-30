const otpGenerator = require("otp-generator");

/**
 * Generates a one-time password (OTP).
 * @returns {string} - The generated OTP.
 */
const OTP = () => {
  // Generate a 5-digit OTP without including uppercase letters, special characters, or lowercase letters
  return otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};

module.exports = OTP;
