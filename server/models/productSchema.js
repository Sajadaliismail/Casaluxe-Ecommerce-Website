const mongoose = require("mongoose");

// Schema for Products
const productSchema = new mongoose.Schema({
  // Name of the product (required, trimmed, uppercase)
  name: { type: String, required: true, trim: true, uppercase: true },
  // Price of the product (required, minimum value 0)
  price: { type: Number, required: true, min: 0, trim: true },
  // Offer percentage of the product (minimum value 0, maximum value 100, default 0)
  offer: { type: Number, min: 0, max: 100, default: 0, trim: true },
  // Material of the product (uppercase)
  material: { type: String, uppercase: true },
  // SKU (Stock Keeping Unit) of the product (uppercase)
  sku: { type: String, uppercase: true },
  // Color of the product (uppercase)
  color: { type: String, uppercase: true },
  // Status of the product (active or inactive)
  status: { type: Boolean },
  // Stock quantity of the product (required, minimum value 0)
  stock: { type: Number, required: true, min: 0 },
  // Images of the product
  image: [{ type: String }],
  // Additional details of the product
  details: { type: String },
  // Description of the product
  description: { type: String },
  // Dimensions of the product
  dimensions: { type: String },
  // Reference to the category the product belongs to
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  // Reference to the room type the product belongs to
  roomtype: { type: mongoose.Schema.Types.ObjectId, ref: "Roomtype" },
  // Date when the product was added (default is the current date)
  date: { type: Date, default: Date.now() },
  // Ratings given to the product
  rating: [{ type: Number }],
});

// Model for Products documents
const Product = mongoose.model("products", productSchema);

module.exports = Product;
