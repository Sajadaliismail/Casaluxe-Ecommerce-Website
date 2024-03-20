const mongoose = require("mongoose");

const adminschema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
});

const Admin = mongoose.model("admin", adminschema);

module.exports = Admin;

