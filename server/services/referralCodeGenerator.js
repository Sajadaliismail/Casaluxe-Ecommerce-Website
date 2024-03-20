function generateReferralCode(name) {
  const letters = name.trim().substring(0, 4).toUpperCase(); 
  const randomNum = Math.floor(Math.random() * 10000); 
  const paddedNum = String(randomNum).padStart(4, '0'); 
  return `${letters}${paddedNum}`;
}

module.exports = generateReferralCode