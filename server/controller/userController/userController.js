const { user } = require("../../models/userSchema");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { MongoError } = require("mongodb");
const { Cart, Wishlist, Item } = require("../../models/cartSchema");
const Order = require("../../models/orderSchema");
const products = require("../../models/productSchema");
const generateReferralCode = require("../../services/referralCodeGenerator");
const generateInvoice = require("../../services/invoiceGenerator");

const jwt = require("jsonwebtoken");
const { wallet, transaction } = require("../../models/walletSchema");
const secret = process.env.JWT_SECRET;

const loginPage = (req, res) => {
  const token = req.cookies.jwt; 
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.render("User/login");
      } else {
        res.redirect("/home");
      }
    });
  } else {
    res.render("User/login");
  }
};

const signUp = (req, res) => {
  try {
    req.session.emailVerify = false;
    res.render("User/signup");
  } catch (error) {
    res
    .status(500)
    .render("User/page-error", { error: "Internal Server Error" });
  }
};

const myAccount = async (req, res) => {
  try {
    const id = req.userId;
    const cart = await Cart.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });
    const order = await Order.find({ userid: id ,isConfirmed:true})
      .sort({ _id: -1 })
      .populate({
        path: "items",
        populate: { path: "product", model: "products" },
      });
    const userData = await user
      .findById(id)
      .populate({ path: "addresses", model: "AddressSchema" });
      const Wallet = await wallet.findById(id).populate({
        path: 'transactions',
        model: 'Transaction' 
    });
      console.log(Wallet);
    res.render("User/myaccount", { userData, cart, order,Wallet });
  } catch (error) {
    res
    .status(500)
    .render("User/page-error", { error: "Internal Server Error" });
  }
};

const forgotPage = (req, res) => {
  res.render("User/forgot");
};

const passwordChange = async (req, res) => {
  const email = req.body.email;

  try {
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    await user.findOneAndUpdate({ email: email }, { password: hashpassword });
    res.redirect("/login");
  } catch (error) {
    res.render("User/forgot", { error: error });
  }
};

const loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userData = await user.findOne({ email: email });
    console.log(userData);
    if (!userData) {
      res.render("User/login", { error: "Incorrect username" });
    }
    if (userData) {
      if (userData.isBlocked) {
        res.render("User/login", { error: "User is blocked" });
      } else {
        const isValid = await bcrypt.compare(password, userData.password);
        if (isValid) {
          const id = userData.id;
          const cart = await Cart.findById(id);
          const wishlist = await Wishlist.findById(id);
          if (wishlist == null) {
            const wishlist = new Wishlist({ _id: id });
            await wishlist.save();
          }
          if (cart == null) {
            const cart = new Cart({ _id: id });

            await cart.save();
          }
          
          const token = jwt.sign({ userId: userData.id }, secret, {
            expiresIn: "1d",
          });
          res.cookie("jwt", token, { httpOnly: true });

          res.redirect("/");
        } else {
          res.render("User/login", { error: "Incorrect password" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.render("User/login", { error: "Server error" });
  }
};


const signupPost = async (req, res) => {
  const { name, email, phone, password, referralCode } = req.body;
  
  if (req.session.emailVerify) {
    try {
      const hashpassword = await bcrypt.hash(password, 10);
      const referral = generateReferralCode(name);

      if (referralCode && referralCode.length === 8) {
        const userData = await user.findOne({ referralCode: referralCode });
        
        if (userData) {
          const amount = 500;
          const gift = 250;
          
          const data = new user({
            name,
            email,
            phone,
            password: hashpassword,
            isBlocked: false,
            isEmailVerified: req.session.emailVerify,
            addressess: [],
            otpemail: [],
            referralCode: referral,
          });
          
          const walletUser = new wallet({ _id: data._id });
          const Transaction = new transaction({
            userId: userData._id,
            type: "referral",
            description: `Bonus as ${name} has joined using your referral code`,
            amount,
            timestamp: Date.now(),
          });

          const TransactionUser = new transaction({
            userId: data._id,
            type: "giftcard",
            description: "Signup bonus",
            amount: gift,
            timestamp: Date.now(),
          });

          walletUser.transactions.push(TransactionUser._id);
          walletUser.balance += gift;
      
          await Promise.all([
            Transaction.save(),
            TransactionUser.save(),
            wallet.findByIdAndUpdate(userData._id, {
              $inc: { balance: amount },
              $push: { transactions: Transaction._id },
            }),
            walletUser.save(),
            data.save(),
          ]);

          return res.json({ success: true });
        } else {
          return res.json({ success: false, message: "Invalid referral code" });
        }
      } 
      
      const data = new user({
        name,
        email,
        phone,
        password: hashpassword,
        isBlocked: false,
        isEmailVerified: req.session.emailVerify,
        addressess: [],
        otpemail: [],
        referralCode: referral,
      });

      const walletUser = new wallet({ _id: data._id });
      await Promise.all([walletUser.save(), data.save()]);
      
      return res.json({ success: true });
      
    } catch (error) {
      console.log(error);
      console.error("Error during signup:", error);
      if (error && error.code === 11000) {
        if (error.keyPattern.email) {
          return res.json({ success: false, message: "Email is already registered." });
        } else if (error.keyPattern.phone) {
          return res.json({ success: false, message: "Phone number is already registered." });
        }
      } else if (error instanceof mongoose.Error.ValidationError) {
        return res.json({ success: false, message: "Check phone number again" });
      } else {
        return res.json({ success: false, message: "Error during signup" });
      }
    }
  } else {
    return res.json({ success: false, message: "Email is not verified" });
  }
};


const logout = (req, res) => {
  res.set("Cache-Control", "no-store");
  res.clearCookie("jwt");
  res.redirect("/login");
};

const wishList = async (req, res) => {
  id = req.userId;
  try {
    const wishlist = await Wishlist.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });
    const cart = await Cart.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });
    console.log(wishlist);
    res.render("User/wishlist", { cart, wishlist });
  } catch (error) {
    res
      .status(500)
      .render("User/page-error", { error: "Internal Server Error" });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const id = req.userId;
    const productid = req.body.product;
    const newcount = req.body.count;

    if (newcount > 3) {
      return res.json({ limit: "Sorry, you can add only three items." });
    }

    const wishlist = await Wishlist.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });

    if (
      wishlist.products.some(
        (product) =>
          JSON.stringify(product.product._id) === JSON.stringify(productid)
      ) &&
      newcount > 0
    ) {
      const index = wishlist.products.findIndex(
        (product) =>
          JSON.stringify(product.product._id) === JSON.stringify(productid)
      );
      const itemid = wishlist.products[index].id;

      if (parseInt(newcount) + wishlist.products[index].count > 3) {
        return res.json({ limit: "Sorry, you can add only three items." });
      } else {
        await Item.findByIdAndUpdate(
          itemid,
          { $inc: { count: newcount } },
          { new: true }
        );
      }
    } else {
      const items = new Item({
        product: req.body.product,
        count: req.body.count,
      });
      await items.save();
      wishlist.products.push(items);
      await wishlist.save();

      res.send({ success: "Success" });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.json({ message: "Add at least one item" });
    } else {
      console.log(error);
    }
  }
};

const removeItemWishlist = async (req, res) => {
  const id = req.userId;
  const itemId = req.body.itemId;
  console.log(itemId, "asf", id);

 try {
   const wishlist = await Wishlist.findById(id).populate({
     path: "products",
     populate: { path: "product", model: "products" },
   });
   console.log("asff", itemId, "asf", id);
   if (
     wishlist.products.some(
       (product) => JSON.stringify(product._id) === JSON.stringify(itemId)
     )
   ) {
     const index = wishlist.products.findIndex(
       (product) => JSON.stringify(product._id) === JSON.stringify(itemId)
     );
     await Item.findByIdAndDelete(wishlist.products[index]._id);
     wishlist.products.splice(index, 1);
     await wishlist.save();
     return res.json({ status: "success", message: "Success", success: true });
   }
 } catch (error) {
  res.json({error})
  
 }
};

const changePassword = async (req, res) => {
    const id = req.userId;
    const oldPassword = req.body.oldpassword;
    const password = req.body.password
  try {
    const userData = await user.findById(id);
    const isValid = await bcrypt.compare(
      oldPassword,
      userData.password
    );
    if (isValid) {
      const hashpassword = await bcrypt.hash(password, 10);
      await user.findByIdAndUpdate(id, { password: hashpassword });
      return res.json({ success: true });
    } else {
      return res.json({ failed: true });
    }
  } catch (error) {
    return res.json({ error: true });
  }
};

const updateDetails = async (req,res)=>{
  const { userName , email , phone } = req.body 
  const id = req.userId
  const userData = await user.findById(id)
  console.log(req.session.emailVerify);
console.log(req.body);
try {
  const updatedData = {};

  if (userName && userName !== userData.name) {
    updatedData.name = userName
  }
  if (phone && phone!== userData.phone){
    updatedData.phone = phone;
  }
  if (email && email !== userData.email) {
    if(req.session.emailVerify === true)
    {
      updatedData.email = email;
    }
    else{
      return res.json({failed:true, message: "Email not verified" });
    }
  }
  if (Object.keys(updatedData).length == 0) {
    return res.json({failed:true, message: "No update parameters provided" });
} else{
  await user.findByIdAndUpdate(id, updatedData);
  return res.json({ success: true, message: "Details updated successfully" });
}

}
 catch (error) {
  if (error && error.code === 11000) {
    return res.json({ status: "failed", message: "Email linked with other account", failed: true });
} else{
  console.error("Error in updateDetails:", error);
  return res.status(500).json({ error: "Internal server error" });}
}
  
}

const printInvoice = async (req, res) => {
 
      try {
  
        const orderId = req.query.id
       
        const orderData = await Order.findById(orderId).populate({
          path: 'items',
          populate: {
              path: 'product',
              model: 'products'
          }
      })
      .populate({
          path: 'userid',
          model: 'users'
      }).populate({
        path: 'address',
        model: 'AddressSchema'
    })
          console.log(orderData,orderData.items[0].product.name);
        const { fileName, pdfBuffer } = await generateInvoice(orderData);
          res.setHeader('Content-disposition', `attachment; filename="${fileName}"`);
          res.setHeader('Content-type', 'application/pdf');
          res.send(pdfBuffer);
  
  } catch (error) {
    console.log(error);
      console.error('Error generating PDF report:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
  }

  const addMoneyToWallet = async (req,res) =>{
    try {
      const { amount } = req.body; 
      const id = req.userId

      const userdata = await user.findById(id);
      const Transaction = new transaction({
        userId: userdata._id,
        amount: amount,
        type : 'deposit',
        description: 'Money added to wallet'
      })
      await Transaction.save()
     
      const instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
      });
  
      const amountInPaise = Number(amount) * 100;
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: ""+Transaction._id, 
      };
  console.log(options);
     
      const razorpayOrder = await new Promise((resolve, reject) => {
        instance.orders.create(options, async (err, order) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
           
            resolve(order);
          }
        });
      });
      console.log(razorpayOrder);
      return res.json({
        status: "Success",
        message: razorpayOrder,
        user: userdata,
        Transaction,
        success:true
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
  
  }

  function hmac_sha256(data, key) {
    return crypto.createHmac("sha256", key).update(data).digest("hex");
  }

  const verifyPayment = async (req, res) => {
    const { amount, transaction, payment_id, order_id, signature } = req.body;
    console.log(req.body);
    const userId = req.userId;

    try {
      const secret = process.env.KEY_SECRET;
      console.log(secret);
      const generated_signature = hmac_sha256(
        order_id + "|" + payment_id,
        secret
      );
  
      if (generated_signature === signature) {
    const Wallet = await wallet.findById(userId)
    Wallet.transactions.push(transaction)
    Wallet.balance += Number(amount)
    await Wallet.save()
        res.json({ success: true, message: 'success' });
      } else {
        
        console.error("Invalid payment signature");
        res
          .status(400)
          .json({ success: false, error: "Invalid payment signature" });
      }
    } catch (error) {
    
      console.error("Error handling payment success:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };  

const errorPage = (req, res) => {
  res.render("User/page-error", { error: "404" });
};

module.exports = {
  loginPage,
  signUp,
  myAccount,
  forgotPage,
  passwordChange,
  changePassword,
  loginPost,
  signupPost,
  logout,
  wishList,
  errorPage,
  addToWishlist,
  removeItemWishlist,
  updateDetails,
  printInvoice,
  addMoneyToWallet,
  verifyPayment
};
