const mongoose = require("mongoose");

// Schema for Room types
const RoomtypeSchema = new mongoose.Schema({
  // Name of the room type (unique, required, trimmed, uppercase)
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  // URL for the room type (unique, required, trimmed, lowercase)
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  // Description of the room type (required, trimmed, uppercase)
  description: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  // Flag indicating if the room type is active (default true)
  isActive: {
    type: Boolean,
    default: true
  }
});

// Model for Roomtype documents
const Roomtype = mongoose.model("Roomtype", RoomtypeSchema);

module.exports = Roomtype;
