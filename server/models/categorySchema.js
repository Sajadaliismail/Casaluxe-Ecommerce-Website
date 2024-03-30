const mongoose = require("mongoose");

// Define category schema
const categorySchema = new mongoose.Schema({
  // Name of the category (required, unique)
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  // URL slug for the category (required, unique)
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  // Description of the category (required)
  description: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  // Indicates whether the category is active (default: true)
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create model for Category documents
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
