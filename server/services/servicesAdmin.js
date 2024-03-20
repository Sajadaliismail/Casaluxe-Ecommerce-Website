const express = require("express");
const Category = require("../models/categorySchema");
const RoomType = require("../models/roomtypeSchema");
const Products = require("../models/productSchema");
const { user } = require("../models/userSchema");
const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");


const loginPage = (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.session.isAuth) {
    res.render("Admin/dashboard");
  } else {
    res.render("Admin/loginadmin"); 
  }
};

const users = async (req, res) => {
  const userData = await user.find().exec();
  console.log(userData);
  res.render("Admin/users", { user: userData });
};

const userInfo = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const userInfo = await user.findById(id);
    res.render("Admin/userinfo", { user: userInfo });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const products = async (req, res) => {
  const productData = await Products
    .find()
    .populate("category")
    .populate("roomtype")
    .exec();
    console.log(productData);
  res.render("Admin/products", { product: productData });
};

const addProduct = async (req, res) => {
  const categoryData = await Category.find({isActive:true});
  const roomData = await RoomType.find({isActive:true});
  res.render("Admin/addproduct", {
    category: categoryData,
    roomtype: roomData,
  });
};

const viewProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productInfo = await Products
      .findById(id)
      .populate("category")
      .populate("roomtype")
      .exec();
      console.log(productInfo);
    res.render("Admin/viewproduct", { product: productInfo });
  } catch (error) {}
};

const editProduct = async (req, res) => {
  const categoryData = await Category.find();
  const roomData = await RoomType.find();
  try {
    const id = req.params.id;
    const productInfo = await Products
      .findById(id)
      .populate("category")
      .populate("roomtype")
      .exec();
      console.log(productInfo)
    res.render("Admin/editproduct", {
      product: productInfo,
      category: categoryData,
      roomtype: roomData,
    });
  } catch (error) {}
};

const orderPage = async (req, res) => {
  
  const order = await Order.find({isConfirmed:true}).sort({ _id: -1 }).populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'products'
        }
    })
    .populate({
        path: 'userid',
        model: 'users'
    });

  console.log(order);
  res.render("Admin/orders",{order});
}

const orderDetails = async (req, res) => {
  const orderId = req.params.id
  const order = await Order.findById(orderId)
    .populate({
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
  console.log(order);
  res.render("Admin/order-details",{order});
}



const categories = async (req, res) => {
  await Category.find().then((data) => {
    res.render("Admin/categories", { category: data });
  });
};

const updateCategory = async (req, res) => {
  const id = req.query.id;
  Category.findById(id).then((data) => {
    console.log(data);
    res.render("Admin/update", {
      data
    });
  });
};

const roomType = async (req, res) => {
  await RoomType.find().then((data) => {
    res.render("Admin/roomtype", { roomtype: data });
  });
};

const updateRoomType = async (req, res) => {
  const id = req.query.id;
  RoomType.findById(id).then((data) => {
    res.render("Admin/updateroomtype", {
      data
    });
  });
};

const couponPage = async (req,res) => {
  const coupons = await Coupon.find()
  res.render('Admin/coupons',{coupons})
}

const couponCreatePage = async (req,res) => {
  const category = await Category.find()
  const product = await Products.find()
  res.render('Admin/couponsCreate',{category,product})
}

const couponEditPage = async (req,res) =>{
  const id = req.params.id
  const category = await Category.find()
  const product = await Products.find()
  const coupon = await Coupon.findById(id)
  res.render('Admin/couponsEdit',{coupon,category,product})
}
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
  couponEditPage

};
