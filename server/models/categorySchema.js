const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
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

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
