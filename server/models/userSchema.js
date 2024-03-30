const mongoose = require("mongoose");

// Schema for OTP verification
const otpschema = new mongoose.Schema({
  // OTP value
  otp: { type: String, required: true },
  // Email associated with the OTP
  email: { type: String },
  // Creation timestamp of the OTP document, expires after 3000 milliseconds (5 minutes)
  createdAt: { type: Date, default: Date.now(), expires: 3000 },
});

// Schema for user addresses
const addressSchema = new mongoose.Schema({
  // Name associated with the address
  name: { type: String, required: true },
  // Street address
  street: { type: String, required: true },
  // Landmark (optional)
  landmark: { type: String },
  // State of the address
  state: { type: String, required: true },
  // City of the address
  city: { type: String },
  // District of the address
  district: { type: String, required: true },
  // Postal code of the address
  postalCode: { type: String, required: true, default: '' },
  // Phone number associated with the address
  phone: { type: Number, required: true },
  // Reference to the user owning the address
  user_id: { type: String }
});
// Model for user addresses
const AddressSchema = mongoose.model("AddressSchema", addressSchema);

// Schema for user accounts
const userSchema = new mongoose.Schema({
  // Name of the user
  name: { type: String, required: true, trim: true },
  // Email of the user (unique, lowercase)
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  // Phone number of the user (unique, minimum length of 10 characters)
  phone: { type: String, unique: true, minlength: 10 },
  // Password of the user
  password: { type: String },
  // Flag indicating if the user is blocked or not (default false)
  isBlocked: { type: Boolean, default: false },
  // Array of addresses associated with the user (maximum 5 addresses)
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
  // Referral code associated with the user
  referralCode: { type: String },
});

// Model for OTP documents
const OTPschema = mongoose.model("otps", otpschema);

// Model for user documents
const user = mongoose.model("users", userSchema);

module.exports = { user, AddressSchema, OTPschema };
