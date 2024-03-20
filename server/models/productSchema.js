
const mongoose = require("mongoose");

  const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true,uppercase: true },
    price: { type: Number, required: true, min: 0, trim: true },
    offer: { type: Number, min: 0,max:100, trim: true,default:0 },
    material: { type: String,uppercase: true },
    sku: { type: String,uppercase: true },
    color: { type: String,uppercase: true },
    status: { type: Boolean },
    stock: { type: Number, required: true, min: 0 },
    image: [{ type: String }],
    details: { type: String },
    description: { type: String },
    dimensions: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    roomtype: { type: mongoose.Schema.Types.ObjectId, ref: "Roomtype" },
    date: { type: Date, default: Date.now() },
    rating: [{type:Number}],
  });

const products = mongoose.model("products", productSchema);

module.exports = products;
