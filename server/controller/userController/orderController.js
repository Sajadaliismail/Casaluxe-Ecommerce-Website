const couponSchema = require("../../models/couponSchema");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { user, AddressSchema } = require("../../models/userSchema");
const mongoose = require("mongoose");
const { item, cartSchema } = require("../../models/cartSchema");
const Order = require("../../models/orderSchema");
const products = require("../../models/productSchema");
const { wallet, transaction } = require("../../models/walletSchema");

const checkoutPage = async (req, res) => {
  const orderId = req.query.orderid;
  const id = req.userId;
  const userdata = await user.findById(id).populate({
    path: "addresses",
    model: "AddressSchema",
  });
  const Wallet = await wallet.findById(id).populate({
    path: "transactions",
    model: "Transaction",
  });
  const order = await Order.findById(orderId).populate({
    path: "items",
    populate: { path: "product", model: "products" },
  });
  const cart = await cartSchema.findById(id).populate({
    path: "products",
    populate: { path: "product", model: "products" },
  });
  console.log(order);
  try {
    const productAndCategoryIdsInOrder = order.items.map((item) => ({
      productId: item.product._id,
      categoryId: item.product.category,
    }));
    const productIdsInOrder = productAndCategoryIdsInOrder.map(
      (item) => item.productId
    );
    const categoryIdsInOrder = productAndCategoryIdsInOrder.map(
      (item) => item.categoryId
    );
    console.log(categoryIdsInOrder);

    const coupons = await couponSchema.find({
      $and: [
          { status: true }, 
          {
              $or: [
                  { products: productIdsInOrder },
                  { categories: categoryIdsInOrder },
              ],
          }
      ],
  });
  
    console.log(coupons);
    if (order.isConfirmed) {
      res.redirect("/cart");
    } else {
      res.render("User/checkout", { cart, order, userdata, coupons, Wallet });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/cart");
  }
};

function hmac_sha256(data, key) {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

const verifyPayment = async (req, res) => {
  const { orderId, payment_id, order_id, signature } = req.body;
  const order = await Order.findOne({ orderId: orderId });
  try {
    const secret = process.env.KEY_SECRET;
    const generated_signature = hmac_sha256(
      order_id + "|" + payment_id,
      secret
    );

    if (generated_signature === signature) {
      order.isConfirmed = true;
      order.paymentStatus = "razorpay-success";
      order.save();
      console.log("Payment success:", payment_id);
      res.json({ success: true, message: orderId });
    } else {
      order.paymentStatus = "pending";
      order.save();
      console.error("Invalid payment signature");
      res
        .status(400)
        .json({ success: false, error: "Invalid payment signature" });
    }
  } catch (error) {
    order.paymentStatus = "pending";
    order.save();
    console.error("Error handling payment success:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  const orderId = req.body.orderId;
  const id = req.userId;
  const order = await Order.findById(orderId).populate({
    path: "items",
    populate: { path: "product", model: "products" },
  });

  await Order.findByIdAndUpdate(orderId, {
    orderStatus: "canceled",
    cancelOrder: Date.now(),
  });

  order.items.forEach(async (item) => {
    await products.findByIdAndUpdate(item.product._id, {
      $inc: { stock: item.count },
    });
  });

  res.json({ success: true });
};

const orderSuccess = async (req, res) => {
  const id = req.userId;
  const orderId = req.query.orderid;
  const cart = await cartSchema.findById(id).populate({
    path: "products",
    populate: { path: "product", model: "products" },
  });
  const order = await Order.findOne({orderId:orderId})
  if(order){
  res.render("User/orderSuccess", { orderId, cart });
}
else{
  res.redirect('/shop')
}
};

const orderFailure = async (req, res) => {
  console.log(req.body);
  const orderId = req.body.orderId;
  try {
    await Order.findOneAndUpdate(
      { orderId: orderId },
      {
        paymentStatus: "pending",
      }
    );
    return res.json({ success: true });
  } catch (error) {}
};

const placeOrder = async (req, res) => {
  try {
    const orderId = req.body.order_id;
    const userId = req.userId;
    const order = await Order.findById(orderId);
    const userdata = await user.findById(userId);

    if (order.isConfirmed) {
      return res.json({
        status: "failed",
        message: "Order is already confirmed",
        alreadyConfirmed: true,
      });
    }
    if (order.paymentStatus !== "pending") {
      return res.json({
        status: "failed",
        message: "Order payment is initiated",
        alreadyConfirmed: true,
      });
    }
    if (!req.body.address) {
      return res.json({
        status: "failed",
        message: "Address not filled",
        addressNotFilled: true,
      });
    }

    let address;
    if (req.body.address === "newAddress") {
      const {
        name,
        street,
        landmark,
        state,
        city,
        district,
        zipcode,
        phonenumber,
      } = req.body;

      address = new AddressSchema({
        name: name,
        street: street,
        landmark: landmark,
        state: state,
        city: city,
        district: district,
        postalCode: zipcode,
        phone: phonenumber,
        user_id: userId,
      });
      await address.save();
      userdata.addresses.push(address);
      await userdata.save();
    } else {
      address = await AddressSchema.findById(req.body.address);
    }
    if (order.totalAmountAfterDiscount == 0) {
      await Order.findByIdAndUpdate(orderId, {
        address: address,
        isConfirmed: true,
        paymentmethod: "noPayment",
      });
      return res.json({
        status: "Success",
        message: order.orderId,
        placed: true,
      });
    }
    if (req.body.paymentMethod === "COD") {
      if(order.totalAmountAfterDiscount>=1000){
        return res.json({
          status: "failed",
          message: "COD not available for orders above 1000.00",
          codnotallowed: true,
        });
      }
      await Order.findByIdAndUpdate(orderId, {
        address: address,
        isConfirmed: true,
      });
      return res.json({
        status: "Success",
        message: order.orderId,
        placed: true,
      });
    } else if (req.body.paymentMethod === "razorpay") {
      const instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
      });

      const options = {
        amount: order.totalAmountAfterDiscount * 100,
        currency: "INR",
        receipt: "" + order._id,
      };

      const razorpayOrder = await new Promise((resolve, reject) => {
        instance.orders.create(options, async function (err, order) {
          if (err) {
            console.log(err);
            await Order.findByIdAndUpdate(orderId, {
              paymentStatus: "pending",
            });
            reject(err);
          } else {
            await Order.findByIdAndUpdate(orderId, {
              paymentStatus: "Payment Initiated",
            });
            resolve(order);
          }
        });
      });
      await Order.findByIdAndUpdate(req.body.order_id, {
        address: address,
      });

      return res.json({
        status: "Success",
        message: razorpayOrder,
        orderId: order.orderId,
        user: userdata,
        razorpay: true,
      });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.json({
        status: "failed",
        message: "Please fill the address",
        Address: true,
      });
    } else {
      return res.json({
        status: "Error",
        message: error.message,
      });
    }
  }
};

const applyCoupon = async (req, res) => {
  const couponId = req.body.couponId;
  const orderId = req.body.orderId;

  const order = await Order.findById(orderId).populate({
    path: "items",
    populate: { path: "product", model: "products" },
  });

  const couponApplied = order.items.some((item) => item.couponDiscount > 0);

  if (couponApplied) {
    return res.json({
      success: false,
      message: "Coupon has already been applied to this order",
    });
  }
  console.log(order);
  const coupon = await couponSchema.findById(couponId);
  if (coupon) {
    const currentDate = new Date();

    if (coupon.endDate < currentDate) {
      return res.json({ expired: true });
    }
    for (const items of order.items) {
      if (
        (coupon.products &&
          items.product._id.toString() === coupon.products.toString()) ||
        (coupon.categories &&
          items.product.category.toString() === coupon.categories.toString())
      ) {
        const updatedItem = await item.findByIdAndUpdate(
          items._id,
          {
            couponDiscount: coupon.discount,
          },
          { new: true }
        );

        updatedItem.couponDiscountReduction =
          ((updatedItem.couponDiscount || 0) *
            (updatedItem.productPrice || 0)) /
          100;
        updatedItem.priceAfterDiscounts =
          (updatedItem.productPrice || 0) -
          (updatedItem.offerPriceReduction || 0) -
          (updatedItem.couponDiscountReduction || 0);

        await updatedItem.save();

        const totalDiscountPipeline = [
          {
            $match: { orderId: order.orderId },
          },
          {
            $lookup: {
              from: "items",
              localField: "items",
              foreignField: "_id",
              as: "populatedItems",
            },
          },
          {
            $unwind: "$populatedItems",
          },
          {
            $set: {
              "populatedItems.priceAfterDiscounts": {
                $multiply: [
                  {
                    $subtract: [
                      {
                        $subtract: [
                          "$populatedItems.productPrice",
                          "$populatedItems.offerPriceReduction",
                        ],
                      },
                      "$populatedItems.couponDiscountReduction",
                    ],
                  },
                  "$populatedItems.count",
                ],
              },
            },
          },
          {
            $group: {
              _id: "$_id",
              totalAmountAfterDiscount: {
                $sum: "$populatedItems.priceAfterDiscounts",
              },
            },
          },
        ];

        const result = await Order.aggregate(totalDiscountPipeline);

        const totalAmountAfterDiscount =
          result.length > 0 ? result[0].totalAmountAfterDiscount : 0;
        await Order.findByIdAndUpdate(
          orderId,
          { totalAmountAfterDiscount: totalAmountAfterDiscount },
          { new: true }
        );
      }
    }
    const orders = await Order.findById(orderId).populate({
      path: "items",
      populate: { path: "product", model: "products" },
    });
    return res.json({ success: true, status: "Success", order: orders });
  }
  return res.json({ failed: true, status: "failed" });
};

const removeCoupon = async (req, res) => {
  const couponId = req.body.couponId;
  const orderId = req.body.orderId;

  const order = await Order.findById(orderId).populate({
    path: "items",
    populate: { path: "product", model: "products" },
  });
  const coupon = await couponSchema.findById(couponId);

  if (coupon) {
    for (const items of order.items) {
      if (
        (coupon.products &&
          items.product._id.toString() === coupon.products.toString()) ||
        (coupon.categories &&
          items.product.category.toString() === coupon.categories.toString())
      ) {
        // Update item to remove coupon discount
        const updatedItem = await item.findByIdAndUpdate(
          items._id,
          {
            couponDiscount: 0,
          },
          { new: true }
        );

        updatedItem.couponDiscountReduction = 0;
        updatedItem.priceAfterDiscounts =
          (updatedItem.productPrice || 0) -
          (updatedItem.offerPriceReduction || 0);

        await updatedItem.save();
        const orders = await Order.findById(orderId).populate({
          path: "items",
          populate: { path: "product", model: "products" },
        });
        const totalAmountAfterDiscount = orders.items.reduce((total, item) => {
          const priceAfterDiscounts = item.priceAfterDiscounts * item.count;
          return total + priceAfterDiscounts;
        }, 0);

        await Order.findByIdAndUpdate(
          orderId,
          { totalAmountAfterDiscount: totalAmountAfterDiscount },
          { new: true }
        );
      }
    }
    const orders = await Order.findById(orderId).populate({
      path: "items",
      populate: { path: "product", model: "products" },
    });
    return res.json({ success: true, status: "Success", order: orders });
  }
  return res.json({ failed: true, status: "failed" });
};

const returnOrder = async (req, res) => {
  const orderId = req.body.orderId;
  try {
    await Order.findByIdAndUpdate(orderId, {
      orderStatus: "returned",
    });
    return res.json({ success: true });
  } catch (error) {}
};

const moveToCart = async (req, res) => {
  const userId = req.userId;
  const orderId = req.body.orderId;

  try {
    const orderData = await Order.findById(orderId).populate({
      path: "items",
      populate: { path: "product", model: "products" },
    });

    if(orderData.paymentStatus == 'Payment Initiated'){
    return  res.json({paymentInProgress : true,message : 'Payment is in progress'})
    }

    const cartData = await cartSchema.findById(userId);
    cartData.products = [];
    const promises = orderData.items.map(async (product) => {
      const productData = new item({
        product: product.product._id,
        count: product.count,
        productPrice: product.productPrice,
        offerDiscounts: product.offerDiscounts,
      });

      await productData.save();

      const updateOperation = {
        $inc: { stock: product.count },
      };

      await products.findByIdAndUpdate(product.product._id, updateOperation);

      cartData.products.push(productData._id);
    });

    await Promise.all(promises);

    await cartData.save();

    await Order.findByIdAndDelete(orderId);

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  placeOrder,
  cancelOrder,
  checkoutPage,
  orderSuccess,
  verifyPayment,
  applyCoupon,
  removeCoupon,
  returnOrder,
  orderFailure,
  moveToCart,
};
