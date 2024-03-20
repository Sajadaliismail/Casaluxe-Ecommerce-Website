const express = require("express");
const route = express.Router();
const session = require("express-session");
const adminController = require("../controller/adminController/adminController");
const reportController = require('../controller/adminController/reportController')
const couponController = require('../controller/adminController/couponController')
const chartController = require('../controller/adminController/chartController')


const service = require("../services/servicesAdmin");
const upload = require('../middlewares/multerMiddleware');
const {adminsession,isAuthenticated} = require("../middlewares/adminSessionMiddleware");

route.use(adminsession);

// Login
route.get("/", service.loginPage);
route.post("/login", adminController.loginPost);

// User
route.get("/users", isAuthenticated, service.users);
route.get("/api/userinfo/:id", isAuthenticated, service.userInfo);
// route.delete("/api/users/:id", isAuthenticated, adminController.deleteUser);
route.patch("/api/users/:id", isAuthenticated, adminController.blockUser);

// Category
route.get("/categories", isAuthenticated, service.categories);
route.get("/api/category", isAuthenticated, service.updateCategory);

route.post("/api/addcategory", isAuthenticated, adminController.addCategory);
route.post("/api/category/:id", isAuthenticated, adminController.blockCategory);
route.post("/api/updatecategory", isAuthenticated, adminController.updateCategory);

// Room Type
route.get("/roomtypes", isAuthenticated, service.roomType);
route.get("/api/roomtype", isAuthenticated, service.updateRoomType);

route.post("/api/addroomtype", isAuthenticated, adminController.addRoomType);
route.post("/api/roomtype/:id", isAuthenticated, adminController.blockRoomType);
route.post("/api/updateroomtype", isAuthenticated, adminController.updateRoomType);

// Product
route.get("/product", isAuthenticated,  service.products);
route.get("/addproduct", isAuthenticated, service.addProduct);

route.get("/api/productinfo/:id", isAuthenticated, service.viewProduct);
route.get("/api/editproduct/:id", isAuthenticated, service.editProduct);

route.post("/api/addproduct", upload.any(), isAuthenticated , adminController.addProduct);
route.post("/api/editproduct/:id", upload.any(), isAuthenticated, adminController.editProduct);
route.post("/api/product/:id", isAuthenticated, adminController.blockProduct);

route.post("/logout", adminController.logout);

route.get("/orders", isAuthenticated, service.orderPage);
route.get("/order-details/:id", isAuthenticated,service.orderDetails);
route.post('/editorder',isAuthenticated, adminController.editOrder);

route.get("/coupons", isAuthenticated, service.couponPage);
route.get("/createCoupon", isAuthenticated, service.couponCreatePage);
route.post('/createCoupon',isAuthenticated,couponController.createCoupon)
route.get("/couponEdit/:id", isAuthenticated, service.couponEditPage);
route.post("/couponEdit/", isAuthenticated, couponController.couponEdit);
route.post('/api/coupon/:id',isAuthenticated,couponController.blockCoupon)

route.get("/settings", isAuthenticated, (req, res) => {res.render("Admin/settings");});
route.get("/transaction", isAuthenticated, (req, res) => {res.render("Admin/transaction");});
route.get("/statistics", isAuthenticated,async (req, res) => {res.render('Admin/dashboard')});

route.get("/api/statistics", isAuthenticated,chartController.dailyChart );
route.get("/api/statistics/yearly", isAuthenticated,chartController.yearlyChart );
route.get("/api/statistics/monthly", isAuthenticated,chartController.monthlyChart );
route.get("/api/statistics/custom", isAuthenticated,chartController.customChart );


route.get('/api/reports/pdf', reportController.generatePDFReport);
route.get('/api/reports/excel', reportController.generateExcelReport);

module.exports = route;

