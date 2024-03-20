const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const sessionmiddleware = (
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    },
  })
);

module.exports = {sessionmiddleware}
