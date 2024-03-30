const mongoose = require("mongoose");

// Schemas

const adminSchema = require("../../models/adminSchema");
const categoryModel = require("../../models/categorySchema");
const roomTypeModel = require("../../models/roomtypeSchema");
const productSchema = require("../../models/productSchema");
const { user } = require("../../models/userSchema");
const Order = require("../../models/orderSchema");
const { wallet, transaction } = require("../../models/walletSchema");

const loginPost = async (req, res) => {
  const body = req.body;
  try {
    const admin = await adminSchema.findOne();
    if (
      (body.name === admin.name || body.name === admin.email) &&
      body.password === admin.password
    ) {
      req.session.isAuth = true;
      res.redirect("/admin/statistics");
    } else {
      if (body.password !== admin.password) {
        res.render("Admin/loginadmin", { message: "Password incorrect" });
      } else {
        res.render("Admin/loginadmin", {
          message: "Invalid username or email",
        });
      }
    }
  } catch (error) {
    res.render("Admin/loginadmin", { message: "Error occurred" });
    console.log(error);
  }
};

// const deleteUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     await user.findByIdAndDelete(id).then((data) => {
//       if (!data) {
//         res.status(404).send({ message: `Cannot delete with id ${id}` });
//       } else {
//         res.send({ message: "User deleted successfully" });
//       }
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .send({ message: `Could not delete category with id ${id}` });
//   }
// };

const blockUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userData = await user.findById(id);
    await user
      .findByIdAndUpdate(id, {
        $set: { isBlocked: !userData.isBlocked },
      })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: `Cannot block with id ${id}` });
        } else {
          res.send({ message: "Successful" ,status : userData.isBlocked});
        }
      });
  } catch (error) {
    res.status(500).send({ message: `Could not perform action id ${id}` });
  }
};

const addCategory = async (req, res) => {
  const { name, url, description } = req.body;
  try {
    const newCategory = new categoryModel({
      name: name,
      url: url,
      description: description,
    });
    await newCategory.save();
    return res.json({
      status: "success",
      message: "Category saved",
      success: true,
    });
  } catch (error) {
    console.log(error);
    if (error && error.code === 11000) {
      return res.json({
        status: "failed",
        message: "Duplicate entry",
        duplicate: true,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      return res.json({
        status: "failed",
        message: "Fill the details correctly",
        validation: true,
      });
    } else {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
};

const blockCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await categoryModel.findById(id);
    await categoryModel
      .findByIdAndUpdate(id, {
        $set: { isActive: !category.isActive },
      })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: `Cannot block with id ${id}` });
        } else {
          res.send({ message: "Successfull" });
        }
      });
  } catch (error) {
    res.status(500).send({ message: `could not perform action ${id}` });
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.body.objectid;
    const { name, url, description } = req.body;
    console.log(req.body);
    await categoryModel
      .findByIdAndUpdate(
        id,
        {
          name: name,
          url: url,
          description: description,
        },
        {
          runValidators: true,
          new: true,
        }
      )
      // .then((data) => {});
    res.redirect("/admin/categories");
  } catch (error) {
    const id = req.body.objectid;
    categoryModel.findById(id).then((data) => {
      res.render("Admin/update", {
        data,
        error: "Duplicate entry or blank entry",
      });
    });
  }
};

// RoomType

const addRoomType = async (req, res) => {
  const dbData = req.body;
  try {
    const newRoomType = new roomTypeModel({
      name: dbData.name,
      url: dbData.url,
      description: dbData.description,
    });
    await newRoomType.save();
    res.json({ status: "success", message: "Room type saved", success: true });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.json({
        status: "failed",
        message: "Duplicate entry",
        duplicate: true,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      return res.json({
        status: "failed",
        message: "Fill the details correctly",
        validation: true,
      });
    } else {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
};

const blockRoomType = async (req, res) => {
  try {
    const id = req.params.id;
    const roomtype = await roomTypeModel.findById(id);
    await roomTypeModel
      .findByIdAndUpdate(id, {
        $set: { isActive: !roomtype.isActive },
      })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: `Cannot block with id ${id}` });
        } else {
          res.send({ message: "Successfull" });
        }
      });
  } catch (error) {
    res.status(500).send({ message: `could not perform action ${id}` });
  }
};

const updateRoomType = async (req, res) => {
  const id = req.body.objectid;
  try {
    const { name, url, description } = req.body;
    await roomTypeModel.findByIdAndUpdate(
      id,
      {
        name: name,
        url: url,
        description: description,
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.redirect("/admin/roomtypes");
  } catch (error) {
    roomTypeModel.findById(id).then((data) => {
      res.render("Admin/updateroomtype", {
        data,
        error: "Duplicate entry or blank entry",
      });
    });
  }
};

const addProduct = async (req, res) => {
  const files = req.files;
  const {
    name,
    sku,
    material,
    color,
    dimensions,
    details,
    description,
    price,
    stock,
    productOffer,
    category,
    roomtype,
    status,
  } = req.body;
  const imageNames = files.map((file) => file.filename);

  try {
    const newProduct = new productSchema({
      name: name,
      sku: sku,
      material: material,
      color: color,
      dimensions: dimensions,
      details: details,
      description: description,
      price: price,
      stock: stock,
      offer: productOffer,
      category: category,
      roomtype: roomtype,
      status: status,
      image: imageNames,
      date: Date.now(),
    });
    await newProduct.save();
    res.redirect("/admin/product");
  } catch (error) {
    const categoryData = await categoryModel.find();
    const roomData = await roomTypeModel.find();
    if (error instanceof mongoose.Error.ValidationError) {
      console.log(error);
      return res.render("Admin/addproduct", {
        message: "Please fill all details ",
        category: categoryData,
        roomtype: roomData,
      });
    } else {
      console.log(error);
      res.render("Admin/page-error-404", { error: error.message });
    }
  }
};

const editProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const imageNames = [];
    const oldImages = req.body.oldimage;
    const {
      name,
      sku,
      material,
      color,
      dimensions,
      details,
      description,
      price,
      stock,
      productOffer,
      category,
      roomtype,
      status,
    } = req.body;
    if (oldImages) {
      oldImages.forEach((image) => imageNames.unshift(image));
    }
    const files = req.files;
    files.forEach((file) => imageNames.unshift(file.filename));

    await productSchema.findByIdAndUpdate(
      id,
      {
        name: name,
        sku: sku,
        material: material,
        color: color,
        dimensions: dimensions,
        details: details,
        description: description,
        price: price,
        stock: stock,
        offer: productOffer,
        category: category,
        roomtype: roomtype,
        status: status,
        image: imageNames,
        date: Date.now(),
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error);
    const categoryData = await categoryModel.find();
    const roomData = await roomTypeModel.find();
    const id = req.body.objectid;
    const productInfo = await productSchema
      .findById(id)
      .populate("category")
      .populate("roomtype")
      .exec();
    console.log(productInfo);
    res.render("Admin/editproduct", {
      product: productInfo,
      category: categoryData,
      roomtype: roomData,
      error: "Duplicate entry or Invalid entry",
    });
  }
};

const blockProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productData = await productSchema.findById(id);
    await productSchema
      .findByIdAndUpdate(id, {
        $set: { status: !productData.status },
      })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: `Cannot block with id ${id}` });
        } else {
          res.send({ message: "Successfull" });
        }
      });
  } catch (error) {
    res.status(500).send({ message: `could not perform action ${id}` });
  }
};


const editOrder = async (req, res) => {
  const id = req.body.orderid;
  const { orderStatus, paymentStatus, shippingStatus, notes } = req.body;
  console.log(req.body, id);
  try {
    await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: orderStatus,
        paymentStatus: paymentStatus,
        shippingStatus: shippingStatus,
        notes: notes,
      },
      {
        runValidators: true,
        new: true,
      }
    );
    const order = await Order.findById(id);
    if (
      orderStatus === "returned" &&
      (shippingStatus === "pickedup" || shippingStatus === "returned")
    ) {
      const Transaction = new transaction({
        userId: order.userid,
        type: "refund",
        amount: order.totalAmountAfterDiscount,
        description: `Refund of order ${order.orderId}`,
        timestamp: Date.now(),
      });
      await Transaction.save();
      await wallet.findByIdAndUpdate(order.userid, {
        $inc: { balance: order.totalAmountAfterDiscount },
        $push: { transactions: Transaction._id },
      });
    }
    res.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
    res.render("Admin/page-error-404", { error: error.message });
  }
};


const logout = (req, res) => {
  req.session.isAuth = false;
  res.render("Admin/loginadmin", { message: "Logout successful" });
}

module.exports = {
  loginPost,
  // deleteUser,
  blockUser,
  addCategory,
  blockCategory,
  updateCategory,
  addRoomType,
  blockRoomType,
  updateRoomType,
  addProduct,
  editProduct,
  blockProduct,
  logout,
  editOrder,
};
