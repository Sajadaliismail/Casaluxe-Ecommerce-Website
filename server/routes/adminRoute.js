// Import required modules
const express = require("express");
const route = express.Router();
const session = require("express-session");

// Import controllers
const adminController = require("../controller/adminController/adminController");
const reportController = require('../controller/adminController/reportController');
const couponController = require('../controller/adminController/couponController');
const chartController = require('../controller/adminController/chartController');

// Import services and middlewares
const service = require("../services/servicesAdmin");
const upload = require('../middlewares/multerMiddleware');
const { adminsession, isAuthenticated } = require("../middlewares/adminSessionMiddleware");

// Apply admin session middleware to all routes
route.use(adminsession);

// Authentication Routes
route.get("/", service.loginPage); // Login page
route.post("/login", adminController.loginPost); // Login

// User Management Routes
route.get("/users", isAuthenticated, service.users); // User listing page
route.get("/api/userinfo/:id", isAuthenticated, service.userInfo); // Get user info
route.patch("/api/users/:id", isAuthenticated, adminController.blockUser); // Block/unblock user

// Category Management Routes
route.get("/categories", isAuthenticated, service.categories); // Category listing page
route.get("/api/category", isAuthenticated, service.updateCategory); // Update category listing

route.post("/api/addcategory", isAuthenticated, adminController.addCategory); // Add category
route.post("/api/category/:id", isAuthenticated, adminController.blockCategory); // Block/unblock category
route.post("/api/updatecategory", isAuthenticated, adminController.updateCategory); // Update category

// Room Type Management Routes
route.get("/roomtypes", isAuthenticated, service.roomType); // Room type listing page
route.get("/api/roomtype", isAuthenticated, service.updateRoomType); // Update room type listing

route.post("/api/addroomtype", isAuthenticated, adminController.addRoomType); // Add room type
route.post("/api/roomtype/:id", isAuthenticated, adminController.blockRoomType); // Block/unblock room type
route.post("/api/updateroomtype", isAuthenticated, adminController.updateRoomType); // Update room type

// Product Management Routes
route.get("/product", isAuthenticated,  service.products); // Product listing page
route.get("/addproduct", isAuthenticated, service.addProduct); // Add product page

route.get("/api/productinfo/:id", isAuthenticated, service.viewProduct); // View product info
route.get("/api/editproduct/:id", isAuthenticated, service.editProduct); // Edit product page

route.post("/api/addproduct", upload.any(), isAuthenticated, adminController.addProduct); // Add product
route.post("/api/editproduct/:id", upload.any(), isAuthenticated, adminController.editProduct); // Edit product
route.post("/api/product/:id", isAuthenticated, adminController.blockProduct); // Block/unblock product

// Logout Route
route.post("/logout", adminController.logout);

// Order Management Routes
route.get("/orders", isAuthenticated, service.orderPage); // Order listing page
route.get("/order-details/:id", isAuthenticated, service.orderDetails); // Order details page
route.post('/editorder', isAuthenticated, adminController.editOrder); // Edit order

// Coupon Management Routes
route.get("/coupons", isAuthenticated, service.couponPage); // Coupon listing page
route.get("/createCoupon", isAuthenticated, service.couponCreatePage); // Create coupon page
route.post('/createCoupon', isAuthenticated, couponController.createCoupon); // Create coupon
route.get("/couponEdit/:id", isAuthenticated, service.couponEditPage); // Edit coupon page
route.post("/couponEdit/", isAuthenticated, couponController.couponEdit); // Edit coupon
route.post('/api/coupon/:id', isAuthenticated, couponController.blockCoupon); // Block/unblock coupon

// Settings, Transaction, and Statistics Routes
route.get("/settings", isAuthenticated, (req, res) => {res.render("Admin/settings");}); // Settings page
route.get("/transaction", isAuthenticated, (req, res) => {res.render("Admin/transaction");}); // Transaction page
route.get("/statistics", isAuthenticated, async (req, res) => {res.render('Admin/dashboard')}); // Statistics page

// Statistics API Routes
route.get("/api/statistics", isAuthenticated, chartController.dailyChart); // Daily statistics
route.get("/api/statistics/yearly", isAuthenticated, chartController.yearlyChart); // Yearly statistics
route.get("/api/statistics/monthly", isAuthenticated, chartController.monthlyChart); // Monthly statistics
route.get("/api/statistics/custom", isAuthenticated, chartController.customChart); // Custom date range statistics

// Report Routes
route.get('/api/reports/pdf', reportController.generatePDFReport); // Generate PDF report
route.get('/api/reports/excel', reportController.generateExcelReport); // Generate Excel report

module.exports = route;
