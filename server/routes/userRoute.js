const express = require("express");
const route = express.Router();
const session = require('express-session');


//load controllers 
const addressController = require("../controller/userController/addressController");
const cartController = require("../controller/userController/cartController");
const otpController = require("../controller/userController/otpController");
const shopController = require("../controller/userController/shopController");
const userController = require("../controller/userController/userController");
const orderController = require('../controller/userController/orderController')
const googleController = require('../controller/userController/googleController')


// Load middlewares
const {sessionmiddleware} = require("../middlewares/userSessionMiddleware");
const verifyToken = require("../middlewares/jwtMiddleware");

route.use(sessionmiddleware);

route.get("/", verifyToken, shopController.landingPage);

// Signup page
route.get("/signup", userController.signUp);
route.post("/signup", userController.signupPost);

// Login page
route.get("/login", userController.loginPage);
route.post("/login", userController.loginPost);

// OTP send and verify
route.post("/send-otp", otpController.sendOtpEmail);
route.post("/verify-otp", otpController.verifyOtpEmail);

// Check email before password change
route.post("/checkemail", otpController.checkEmail);

// Change password
route.get("/forgotpassword", userController.forgotPage);
route.post("/passwordchange", userController.passwordChange);

// Get category wise products
route.get("/category/:id", verifyToken, shopController.categoryPage);
route.get("/roomtype/:id", verifyToken, shopController.roomTypePage);

// Get all the products, sort and filter 
route.get("/shop", verifyToken, shopController.shopPage);
route.get("/shop/:id", verifyToken, shopController.shopSortingPage);
route.get("/shopdetail", verifyToken, shopController.shopDetails);

// Search for products
route.get("/searchproduct", verifyToken, shopController.searchProduct);

// Product page
route.get("/product/:id", verifyToken, shopController.productPage);

// Account and address management
route.get("/myaccount", verifyToken, userController.myAccount);
route.post('/changepassword',verifyToken,userController.changePassword)
route.post('/updateDetails',verifyToken,userController.updateDetails)

route.post("/addadress", verifyToken, addressController.addAddress);
route.post("/api/defaultaddress", verifyToken, addressController.defaultAddress);
route.delete("/api/deleteaddress", verifyToken, addressController.deleteAddress);
route.get("/api/editaddress/:id", verifyToken, addressController.editAddress);
route.post("/api/editaddress/:id", verifyToken, addressController.editAddress);

// Cart management
route.post("/addtocart", verifyToken, cartController.addToCart);
route.patch("/removeitem", verifyToken, cartController.removeItem);
route.post("/checkout", verifyToken, cartController.checkout);
route.get("/cart", verifyToken, cartController.cartPage);
route.post("/clearcart", verifyToken, cartController.clearCart);
route.get("/cartdetails", verifyToken, cartController.cartDetails);

// Order placement
route.get("/checkout", verifyToken, orderController.checkoutPage);
route.post("/placeorder", verifyToken, orderController.placeOrder);
route.post('/cancelorder', verifyToken, orderController.cancelOrder);
route.get('/ordersuccess',verifyToken,orderController.orderSuccess)
route.post('/paymentfailure',verifyToken,orderController.orderFailure)
route.post('/retrypayment',verifyToken,orderController.retryPayment)
route.post('/rating',verifyToken,shopController.rating)
route.post('/movetocart',verifyToken,orderController.moveToCart)
route.post('/returnorder',verifyToken,orderController.returnOrder)
route.get('/invoice',verifyToken,userController.printInvoice)

route.post('/useWalletCash', verifyToken, orderController.deductMoneyFromWallet);
route.post('/returnWalletCash', verifyToken, orderController.returnMoneyToWallet);
route.post('/addmoneytowallet',verifyToken,userController.addMoneyToWallet)

route.post('/api/applycoupon',verifyToken,orderController.applyCoupon)
route.post('/api/removecoupon',verifyToken,orderController.removeCoupon)

route.post('/payment/success',verifyToken,orderController.verifyPayment)
route.post('/wallet/success',verifyToken,userController.verifyPayment)


// Wishlist 
route.get("/wishlist", verifyToken, userController.wishList);
route.post("/addtowishlist", verifyToken, userController.addToWishlist);
route.patch("/removeitemwishlist", verifyToken, userController.removeItemWishlist);



// Error page
route.get("/error", verifyToken, userController.errorPage);

// Logout
route.all("/logout", userController.logout);

route.get('/auth/google', googleController.authorizationURL);
route.get('/auth/google/callback', googleController.callbackGoogle);
route.get('/api/sessions/oauth/google',googleController.oauthGoogle);





module.exports = route;
