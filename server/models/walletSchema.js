const mongoose = require("mongoose");

// Schema for individual transactions
const transactionSchema = new mongoose.Schema({
  // Reference to the user who initiated the transaction
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  // Type of transaction, restricted to specific values
  type: { type: String, enum: ['purchase', 'deposit', 'withdrawal', 'refund', 'giftcard', "referral"] },
  // Amount involved in the transaction
  amount: { type: Number }, 
  // Description of the transaction
  description: { type: String },
  // Timestamp indicating when the transaction occurred (defaults to current date/time)
  timestamp: { type: Date, default: Date.now }
});

// Schema for user wallets
const walletSchema = new mongoose.Schema({
  // Reference to the user owning the wallet
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  // Current balance in the wallet (defaults to 0, cannot be negative)
  balance: { type: Number, default: 0, min: 0 },
  // Array of transaction references associated with this wallet
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
});

// Model for wallet documents
const wallet = mongoose.model('wallets', walletSchema);

// Model for transaction documents
const transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { wallet, transaction };
