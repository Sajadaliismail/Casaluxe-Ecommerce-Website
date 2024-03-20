  const mongoose = require("mongoose");

  const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    type: { type: String, enum: ['purchase', 'deposit', 'withdrawal', 'refund', 'giftcard',"referral"] },
    amount: { type: Number }, 
    description : {type:String},
    timestamp: { type: Date, default: Date.now }
});

  const walletSchema = new mongoose.Schema({
    _id : {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    balance : {type: Number, default : 0, min : 0},
    transactions : [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  })

  const wallet = mongoose.model('wallets',walletSchema)
  const transaction = mongoose.model('Transaction', transactionSchema);

  module.exports = {wallet, transaction}