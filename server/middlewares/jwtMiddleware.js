const jwt = require('jsonwebtoken');
const { user } = require('../models/userSchema');
const secret = process.env.JWT_SECRET


const verifyToken = async (req, res, next) => {
  res.set("Cache-Control", "no-store");
  const token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    return res.status(401).render('User/login');;
  }
  try {
    const decoded = jwt.verify(token, secret);

    req.userId = decoded.userId;
    const userdata = await user.findById(req.userId)
    if(!userdata.isBlocked){ 
    next();
  }
  else {
    res.clearCookie("jwt");
    res.render("User/login", { error: "User Blocked" });
  }
} catch (error) {
    return res.status(401).render('User/login');
  }
};

module.exports = verifyToken