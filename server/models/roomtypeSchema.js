const mongoose = require("mongoose");

const RoomtypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  isActive: {
    type:Boolean,
    default: true
  }
});

const Roomtype = mongoose.model("Roomtype", RoomtypeSchema);

module.exports = Roomtype;
