const { user, AddressSchema } = require("../../models/userSchema");
const mongoose = require("mongoose");
const { item, cartSchema } = require("../../models/cartSchema");
const Order = require("../../models/orderSchema");
const products = require("../../models/productSchema");


const addToCart = async (req, res) => {
  try {
    const id = req.userId;
    const productid = req.body.product;
    const newcount = req.body.count;
    const product = await products.findById(productid);

    if (newcount > 3) {
      return res.json({ limit: "Sorry, you can buy only three items." });
    }
    else if(newcount<1){
      return res.json({ message: "Sorry, add atleast one item." });

    }

    const carts = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });

    if (
      carts.products.some(
        (product) =>
          JSON.stringify(product.product._id) === JSON.stringify(productid)
      ) &&
      newcount > 0
    ) {
      const index = carts.products.findIndex(
        (product) =>
          JSON.stringify(product.product._id) === JSON.stringify(productid)
      );
      const itemid = carts.products[index].id;

      if (parseInt(newcount) + carts.products[index].count > 3) {
        return res.json({ limit: "Sorry, you can buy only three items." });
      } else if (
        parseInt(newcount) + carts.products[index].count >
        product.stock
      ) {
        return res.json({ stockout: "Sorry, product is out of stock" });
      } else {
        await item.findByIdAndUpdate(
          itemid,
          { $inc: { count: newcount } },
          { new: true }
        );
        res.send({ success: "Success" });
      }
    } else {
      if (parseInt(newcount) > product.stock) {
        return res.json({ stockout: "Sorry, product is out of stock" });
      } else {
        const items = new item({
          product: productid,
          count: newcount,
          productPrice: product.price,
          offerDiscounts : product.offer,

        });
        await items.save();
        carts.products.push(items);
        await carts.save();

        res.send({ success: "Success" });
      }
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.json({ message: "Add at least one item" });
    } else console.log(error);
  }
};

const checkout = async (req, res) => {
  try {
    const userId = req.userId;
    const orderId = "CASA" + Date.now();
    const count = [...req.body.CartItemCount];
    const itemCounts = count.map((value) => parseInt(value));

    // Fetch cart and populate products
    const cart = await cartSchema.findById(userId).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });
  
    let flag = false;

    for (let i = 0; i < cart.products.length; i++) {
      const cartProduct = cart.products[i];
      const product = cartProduct.product;

      if (itemCounts[i] < 1) {
        return res.json({
          status: "failed",
          message: product.name,
          lessThanOne: true,
        });
      } else if (itemCounts[i] > 3) {
        return res.json({
          status: "failed",
          message: product.name,
          greater: true,
        });
      } else if (product.stock >= cartProduct.count) {
        await item.updateOne(
          { _id: cartProduct._id },
          { $set: { count: itemCounts[i] } }
        );
        cartProduct.count = itemCounts[i];
        product.stock -= cartProduct.count;
        await product.save();
        flag = true;
      } else {
        return res.json({
          status: "success",
          message: product.name,
          noStock: true,
        });
      }
    }

    await cart.save();

    if (flag) {
      const totalPrice = cart.products.reduce(
        (total, item) => total + item.productPrice * item.count,
        0
      );
      const totalDiscountPrice = cart.products.reduce(
        (total, item) => total + item.priceAfterDiscounts * item.count,
        0
      );
      const items = cart.products.map((cartProduct) => ({
        _id: cartProduct._id,
      }));

      const order = new Order({
        userid: userId,
        items: items,
        paymentmethod: req.body.paymentMethod,
        totalAmount: totalPrice,
        totalAmountAfterDiscount: totalDiscountPrice,
        orderdate: Date.now(),
        orderId: orderId,
        isConfirmed: false,
      });

      await order.save();
console.log(order);
      // Clear cart products
      cart.products = [];
      await cart.save();

      return res.json({ status: "success", message: order._id, success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const removeItem = async (req, res) => {
  const id = req.userId;
  const productid = req.body.itemId;
  const cart = await cartSchema.findById(id).populate({
    path: "products",
    populate: { path: "product", model: "products" },
  });

  if (
    cart.products.some(
      (product) =>
        JSON.stringify(product.product._id) === JSON.stringify(productid)
    )
  ) {
    const index = cart.products.findIndex(
      (product) =>
        JSON.stringify(product.product._id) === JSON.stringify(productid)
    );
    await item.findByIdAndDelete(cart.products[index]._id);
    cart.products.splice(index, 1);
    await cart.save();
    return res.json({ status: "success", message: "Success", success: true });
  }
};



const clearCart = async (req, res) => {
  try {
    const id = req.userId;
    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });

    cart.products.forEach(async (product) => {
      await item.findByIdAndDelete(product._id);
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.products = [];
    await cart.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const cartPage = async (req, res) => {
  try {
    id = req.userId;

    const userdata = await user.findById(id).populate({
      path: "addresses",
      model: "AddressSchema",
    });

    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });

    let totalPrice = 0;
    cart.products.forEach((item) => {
      totalPrice += item.product.price * item.count;
    });

    res.render("User/cart", { cart: cart, totalPrice: totalPrice, userdata });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

const cartDetails = async (req, res) => {
  try {
    id = req.userId;
    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });
    let totalPriceAfterReduction = 0
    let totalPrice = 0;
    let discounts = 0
    cart.products.forEach((item) => {
      totalPrice += item.productPrice * item.count;
      discounts += item.offerPriceReduction * item.count;
      totalPriceAfterReduction += item.priceAfterDiscounts * item.count;
    });

    res.json({ cart: cart, totalPrice: totalPrice,discounts:discounts,totalPriceAfterReduction:totalPriceAfterReduction });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};


module.exports = {
  addToCart,
  removeItem,
  clearCart,
  cartPage,
  cartDetails,
  checkout,
};
