// Import required modules
const express = require("express");
const Category = require("../models/categorySchema");
const RoomType = require("../models/roomtypeSchema");
const Products = require("../models/productSchema");
const { user } = require("../models/userSchema");
const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");

// Define controller functions

// Render login page
const loginPage = (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.session.isAuth) {
    res.render("Admin/dashboard");
  } else {
    res.render("Admin/loginadmin");
  }
};

// User related functions

// Render users page
const users = async (req, res) => {
  const userData = await user.find().exec();
  res.render("Admin/users", { user: userData });
};

// Render user information page
const userInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const userInfo = await user.findById(id);

    if (!userInfo) {
      return res.render("Admin/page-error-404", { error: "User not found" });
    }

    res.render("Admin/userinfo", { user: userInfo });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.render("Admin/page-error-404", { error: "Error fetching user details" });
  }
};


// Product related functions

// Render products page
const products = async (req, res) => {
  const productData = await Products.find().populate("category").populate("roomtype").exec();
  res.render("Admin/products", { product: productData });
};

// Render add product page
const addProduct = async (req, res) => {
  const categoryData = await Category.find({ isActive: true });
  const roomData = await RoomType.find({ isActive: true });
  res.render("Admin/addproduct", { category: categoryData, roomtype: roomData });
};

// Render view product page
const viewProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productInfo = await Products.findById(id).populate("category").populate("roomtype").exec();

    if (!productInfo) {
      return res.render("Admin/page-error-404", { error: "Product not found" });
    }

    res.render("Admin/viewproduct", { product: productInfo });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.render("Admin/page-error-404", { error: "Error fetching product details" });
  }
};


// Render edit product page
const editProduct = async (req, res) => {
  try {
    const categoryData = await Category.find();
    const roomData = await RoomType.find();
    const id = req.params.id;
    const productInfo = await Products.findById(id).populate("category").populate("roomtype").exec();

    if (!productInfo) {
      return res.render("Admin/page-error-404", { error: "Product not found" });
    }

    res.render("Admin/editproduct", { product: productInfo, category: categoryData, roomtype: roomData });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.render("Admin/page-error-404", { error: "Error fetching product details" });
  }
};


// Order related functions

// Render order page
const orderPage = async (req, res) => {
  const order = await Order.find({ isConfirmed: true }).sort({ _id: -1 }).populate({
    path: "items",
    populate: {
      path: "product",
      model: "products",
    },
  }).populate({
    path: "userid",
    model: "users",
  });
  res.render("Admin/orders", { order });
};

// Render order details page
const orderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "products",
        },
      })
      .populate({
        path: "userid",
        model: "users",
      })
      .populate({
        path: "address",
        model: "AddressSchema",
      });

    if (!order) {
      return res.render("Admin/page-error-404", { error: "Order not found" });
    }

    res.render("Admin/order-details", { order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.render("Admin/page-error-404", { error: "Error fetching order details" });
  }
};


// Category related functions

// Render categories page
const categories = async (req, res) => {
  const data = await Category.find();
  res.render("Admin/categories", { category: data });
};

// Render update category page
const updateCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const data = await Category.findById(id);

    if (!data) {
      return res.render("Admin/page-error-404", { error: "Category not found" });
    }

    res.render("Admin/update", { data });
  } catch (error) {
    console.error("Error fetching category details:", error);
    res.render("Admin/page-error-404", { error: "Error fetching category details" });
  }
};

// Room type related functions

// Render room types page
const roomType = async (req, res) => {
  const data = await RoomType.find();
  res.render("Admin/roomtype", { roomtype: data });
};

// Render update room type page
const updateRoomType = async (req, res) => {
  try {
    const id = req.query.id;
    const data = await RoomType.findById(id);

    if (!data) {
      return res.render("Admin/page-error-404", { error: "Room type not found" });
    }

    res.render("Admin/updateroomtype", { data });
  } catch (error) {
    console.error("Error fetching room type details:", error);
    res.render("Admin/page-error-404", { error: "Error fetching room type details" });
  }
};


// Coupon related functions

// Render coupons page
const couponPage = async (req, res) => {
  const coupons = await Coupon.find();
  res.render("Admin/coupons", { coupons });
};

// Render create coupon page
const couponCreatePage = async (req, res) => {
  const category = await Category.find();
  const product = await Products.find();
  res.render("Admin/couponsCreate", { category, product });
};

// Render edit coupon page
const couponEditPage = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.find();
    const product = await Products.find();
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.render("Admin/page-error-404", { error: "Coupon not found" });
    }

    res.render("Admin/couponsEdit", { coupon, category, product });
  } catch (error) {
    console.error("Error fetching coupon details:", error);
    res.render("Admin/page-error-404", { error: "Error fetching coupon details" });
  }
};


module.exports = {
  loginPage,
  users,
  userInfo,
  products,
  addProduct,
  viewProduct,
  editProduct,
  categories,
  updateCategory,
  roomType,
  updateRoomType,
  orderPage,
  orderDetails,
  couponPage,
  couponCreatePage,
  couponEditPage,
};
