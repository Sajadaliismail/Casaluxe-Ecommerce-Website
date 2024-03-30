const mongoose = require('mongoose');

// Define order schema
const orderSchema = new mongoose.Schema({
  // Reference to the user who placed the order
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Unique identifier for the order
  orderId: { type: String },
  // Array of items in the order, referencing the Item model
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  // Payment method used for the order
  paymentmethod: { type: String },
  // Payment reference (if applicable)
  paymentReference: { type: String },
  // Payment status of the order (default: 'pending')
  paymentStatus: { type: String, default: 'pending' },
  // Total amount of the order
  totalAmount: { type: Number },
  // Total amount after applying discounts
  totalAmountAfterDiscount: { type: Number },
  // Amount of wallet cash used for the order (default: 0)
  walletCashUsed: { type: Number, default: 0 },
  // Shipping address object
  address: { type: Object },
  // Shipping status of the order (default: 'pending')
  shippingStatus: { type: String, default: 'pending' },
  // Order status (default: 'pending')
  orderStatus: { type: String, default: 'pending' },
  // Date when the order was placed (default: current date)
  orderdate: { type: Date, default: Date.now() },
  // Date when the order was last updated
  updateOrderDate: { type: Date },
  // Date when the order was canceled
  cancelOrder: { type: Date },
  // Additional notes related to the order
  notes: { type: String },
  // Flag indicating whether the order is confirmed (default: false)
  isConfirmed: { type: Boolean, default: false }
});

// Create model for Order documents
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
