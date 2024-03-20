const mongoose = require("mongoose");

const otpschema = new mongoose.Schema({
  otp: { type: String, required: true },
  email : {type : String},
  createdAt: { type: Date, default: Date.now(), expires: 3000 },
});


const addressSchema = new mongoose.Schema({
  name: {type: String,required: true,},
  street: { type: String,required: true, },
  landmark: { type: String },
  state: { type: String,required: true, },
  city: { type: String },
  district: {type:String,required: true,},
  postalCode: { type: String,required: true,default : '' },
  phone: { type: Number,required: true, },
  user_id: {type:String}

});
const AddressSchema = mongoose.model("AddressSchema", addressSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: { type: String, unique: true, minlength: 10 },
  password: { type: String },
  isBlocked: { type: Boolean, default: false },
  addresses: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "AddressSchema" }],
    default: [], 
    validate: {
        validator: function(v) {
            return v.length <= 5; 
        },
        message: error => `The maximum number of addresses allowed is 5.`
    }
},
referralCode : {type:String},
});
const OTPschema = mongoose.model("otps", otpschema);
const user = mongoose.model("users", userSchema);

module.exports = { user, AddressSchema, OTPschema };
