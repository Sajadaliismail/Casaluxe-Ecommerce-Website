/**
 * Generates a referral code based on the provided name.
 * @param {string} name - The name used to generate the referral code.
 * @returns {string} - The generated referral code.
 */
function generateReferralCode(name) {
  // Extract the first 4 uppercase letters from the trimmed name
  const letters = name.trim().substring(0, 4).toUpperCase(); 
  
  // Generate a random 4-digit number
  const randomNum = Math.floor(Math.random() * 10000); 
  
  // Pad the random number with leading zeros to ensure it's 4 digits long
  const paddedNum = String(randomNum).padStart(4, '0'); 
  
  // Combine the letters and padded number to create the referral code
  return `${letters}${paddedNum}`;
}

module.exports = generateReferralCode;
