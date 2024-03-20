const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, 
  orderId : {type :String},
  items: [{type: mongoose.Schema.Types.ObjectId, ref: "Item"}],
  paymentmethod: {type : String},
  paymentReference: {type : String},
  paymentStatus: {type : String, default :'pending'},
  totalAmount: {type : Number},
  totalAmountAfterDiscount : {type:Number},
  address: { type: Object}, 
  shippingStatus: {type : String,default :'pending'}, 
  orderStatus: {type : String, default : 'pending'},
  orderdate : { type: Date, default: Date.now() },
  updateOrderDate : {type: Date},
  cancelOrder : {type: Date},
  notes : {type : String},
  isConfirmed : {type:Boolean}
})

const Order = mongoose.model('Order',orderSchema)

module.exports = Order