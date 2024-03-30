const mongoose = require("mongoose");

// Define coupon schema
const couponSchema = new mongoose.Schema({
  // Name of the coupon (required, unique)
  name: { type: String, required: true, unique: true },
  // Description of the coupon
  description: { type: String },
  // Coupon code (required, unique)
  code: { type: String, required: true, unique: true },
  // Discount percentage (required, min: 1, max: 100)
  discount: { type: Number, required: true, min: 1, max: 100 },
  // Minimum amount required for the coupon to be applicable (required, min: 1)
  minAmount: { type: Number, required: true, min: 1 },
  // Maximum discount applicable (min: 1)
  maxDiscount: { type: Number, min: 1 },
  // Start date of the coupon (required)
  startDate: { type: Date, required: true },
  // End date of the coupon (required)
  endDate: { type: Date, required: true },
  // Products associated with the coupon (refers to the products model)
  products: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  // Categories associated with the coupon (refers to the Category model)
  categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  // Usage limit for the coupon
  usageLimit: { type: Number },
  // Status of the coupon (default: true)
  status: { type: Boolean, default: true },
  // Date when the coupon was created (default: current date)
  createdAt: { type: Date, default: Date.now },
  // Date when the coupon was last updated (default: current date)
  updatedAt: { type: Date, default: Date.now }
});

// Create model for Coupon documents
const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
