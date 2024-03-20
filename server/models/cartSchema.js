const mongoose = require('mongoose');


const items = new mongoose.Schema({
  userid : {type: mongoose.Schema.Types.ObjectId, ref: "user"},
  product : {type: mongoose.Schema.Types.ObjectId, ref: "products"},
  count : {type: Number,min: 1,max:3},
  productPrice: {type:Number},
  offerDiscounts : {type:Number},
  offerPriceReduction : {
    type: Number,
    default: function() {
        if (this.offerDiscounts) {
            return this.productPrice * (this.offerDiscounts / 100);
        } else {
            return 0; 
        }
    }
},
couponDiscount:{type:Number},
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
priceAfterDiscounts: {
  type: Number,
  default: function() {
      let priceAfterDiscounts = this.productPrice || 0;
      priceAfterDiscounts -= this.offerPriceReduction || 0;
      priceAfterDiscounts -= this.couponDiscountReduction || 0;
      return priceAfterDiscounts;
  }
},
  rating :{type:Number}
})
const item = mongoose.model('Item',items);


const cartschema = new mongoose.Schema({
  _id : {type: mongoose.Schema.Types.ObjectId, ref: "users"},
  products: [{type: mongoose.Schema.Types.ObjectId, ref: "Item"}],
})

const wishlistschema = new mongoose.Schema({
  _id : {type: mongoose.Schema.Types.ObjectId, ref: "users"},
  products: [{type: mongoose.Schema.Types.ObjectId, ref: "Item"}],
})

const cartSchema = mongoose.model('cartdata',cartschema)
const wishlistSchema = mongoose.model('wishlist',wishlistschema)


module.exports = { item , cartSchema,wishlistSchema }



