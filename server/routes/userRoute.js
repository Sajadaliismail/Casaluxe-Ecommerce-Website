// Import required modules
const express = require('express');
const session = require('express-session');
const route = express.Router();

// Load controllers
const addressController = require('../controller/userController/addressController');
const cartController = require('../controller/userController/cartController');
const otpController = require('../controller/userController/otpController');
const shopController = require('../controller/userController/shopController');
const userController = require('../controller/userController/userController');
const orderController = require('../controller/userController/orderController');
const googleController = require('../controller/userController/googleController');

// Load middlewares
const { sessionmiddleware } = require('../middlewares/userSessionMiddleware');
const verifyToken = require('../middlewares/jwtMiddleware');

// Apply session middleware
route.use(sessionmiddleware);

// Landing and Home pages
route.get('/home', verifyToken, shopController.landingPage);
route.get('/', shopController.homePage);

// User authentication routes
route.get('/signup', userController.signUp); // Signup page
route.post('/signup', userController.signupPost);
route.get('/login', userController.loginPage); // Login page
route.post('/login', userController.loginPost);

// OTP handling routes
route.post('/send-otp', otpController.sendOtpEmail); // Send OTP
route.post('/verify-otp', otpController.verifyOtpEmail); // Verify OTP

// Password management routes
route.post('/checkemail', otpController.checkEmail); // Check email before password change
route.get('/forgotpassword', userController.forgotPage); // Forgot password page
route.post('/passwordchange', userController.passwordChange); // Change password

// Product and Category routes
route.get('/category/:id', verifyToken, shopController.categoryPage); // Category wise products
route.get('/roomtype/:id', verifyToken, shopController.roomTypePage); // Room type wise products
route.get('/shop', verifyToken, shopController.shopPage); // All products, sort and filter
route.get('/shop/:id', verifyToken, shopController.shopSortingPage); // Product sorting
route.get('/shopdetail', verifyToken, shopController.shopDetails); // Product details
route.get('/searchproduct', verifyToken, shopController.searchProduct); // Search products
route.get('/product/:id', verifyToken, shopController.productPage); // Product details

// User account management routes
route.get('/myaccount', verifyToken, userController.myAccount); // Account details
route.post('/changepassword', verifyToken, userController.changePassword); // Change password
route.post('/updateDetails', verifyToken, userController.updateDetails); // Update account details

// Address management routes
route.post('/addadress', verifyToken, addressController.addAddress);
route.post('/api/defaultaddress', verifyToken, addressController.defaultAddress);
route.delete('/api/deleteaddress', verifyToken, addressController.deleteAddress);
route.get('/api/editaddress/:id', verifyToken, addressController.editAddress);
route.post('/api/editaddress/:id', verifyToken, addressController.editAddress);

// Cart management routes
route.post('/addtocart', verifyToken, cartController.addToCart);
route.patch('/removeitem', verifyToken, cartController.removeItem);
route.post('/checkout', verifyToken, cartController.checkout);
route.get('/cart', verifyToken, cartController.cartPage);
route.post('/clearcart', verifyToken, cartController.clearCart);
route.get('/cartdetails', verifyToken, cartController.cartDetails);

// Order management routes
route.get('/checkout', verifyToken, orderController.checkoutPage);
route.post('/placeorder', verifyToken, orderController.placeOrder);
route.post('/cancelorder', verifyToken, orderController.cancelOrder);
route.get('/ordersuccess', verifyToken, orderController.orderSuccess);
route.post('/paymentfailure', verifyToken, orderController.orderFailure);
route.post('/retrypayment', verifyToken, orderController.retryPayment);
route.post('/rating', verifyToken, shopController.rating);
route.post('/movetocart', verifyToken, orderController.moveToCart);
route.post('/returnorder', verifyToken, orderController.returnOrder);
route.get('/invoice', verifyToken, userController.printInvoice);

// Wallet management routes
route.post('/useWalletCash', verifyToken, orderController.deductMoneyFromWallet);
route.post('/returnWalletCash', verifyToken, orderController.returnMoneyToWallet);
route.post('/addmoneytowallet', verifyToken, userController.addMoneyToWallet);

// Coupon management routes
route.post('/api/applycoupon', verifyToken, orderController.applyCoupon);
route.post('/api/removecoupon', verifyToken, orderController.removeCoupon);

// Payment routes
route.post('/payment/success', verifyToken, orderController.verifyPayment);
route.post('/wallet/success', verifyToken, userController.verifyPayment);

// Wishlist management routes
route.get('/wishlist', verifyToken, userController.wishList);
route.post('/addtowishlist', verifyToken, userController.addToWishlist);
route.patch('/removeitemwishlist', verifyToken, userController.removeItemWishlist);

// Error page route
route.get('/error', verifyToken, userController.errorPage);

// Logout route
route.all('/logout', userController.logout);

// Google OAuth routes
route.get('/auth/google', googleController.authorizationURL);
route.get('/auth/google/callback', googleController.callbackGoogle);
route.get('/api/sessions/oauth/google', googleController.oauthGoogle);

module.exports = route;
