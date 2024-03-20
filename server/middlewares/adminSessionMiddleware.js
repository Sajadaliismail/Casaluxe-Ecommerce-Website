const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const  isAuthenticated = function (req, res, next) {
  res.set("Cache-Control", "no-store");
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/admin");
  }
  

}




const adminsession = (
  session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

module.exports = {adminsession,isAuthenticated}