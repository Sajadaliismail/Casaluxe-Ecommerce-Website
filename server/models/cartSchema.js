const mongoose = require('mongoose');

// Define schema for items in cart and wishlist
const itemSchema = new mongoose.Schema({
  // User ID of the user who added the item to cart/wishlist
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  // Product ID of the item
  product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
  // Quantity of the item (min: 1, max: 3)
  count: { type: Number, min: 1, max: 3 },
  // Price of the product
  productPrice: { type: Number },
  // Offer discounts on the product
  offerDiscounts: { type: Number },
  // Reduction in price due to offer discounts
  offerPriceReduction: {
    type: Number,
    default: function() {
      if (this.offerDiscounts) {
        return this.productPrice * (this.offerDiscounts / 100);
      } else {
        return 0; 
      }
    }
  },
  // Coupon discounts on the product
  couponDiscount: { type: Number },
  // Reduction in price due to coupon discounts
  couponDiscountReduction: {
    type: Number,
    default: function() {
      if (this.couponDiscount) {
        return this.productPrice * (this.couponDiscount / 100);
      } else {
        return 0;
      }
    }
  },
  // Price of the product after applying discounts
  priceAfterDiscounts: {
    type: Number,
    default: function() {
      let priceAfterDiscounts = this.productPrice || 0;
      priceAfterDiscounts -= this.offerPriceReduction || 0;
      priceAfterDiscounts -= this.couponDiscountReduction || 0;
      return priceAfterDiscounts;
    }
  },
  // Rating of the product
  rating: { type: Number }
});

// Model for Item documents
const Item = mongoose.model('Item', itemSchema);

// Schema for cart data
const cartSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
});

// Schema for wishlist data
const wishlistSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
});

// Model for cart data
const Cart = mongoose.model('cartdata', cartSchema);

// Model for wishlist data
const Wishlist = mongoose.model('wishlist', wishlistSchema);

module.exports = { Item, Cart, Wishlist };
