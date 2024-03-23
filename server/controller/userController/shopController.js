
const { cartSchema, item } = require("../../models/cartSchema");
const productSchema = require("../../models/productSchema");
const Category = require("../../models/categorySchema");
const RoomType = require("../../models/roomtypeSchema");
const products = require("../../models/productSchema");
const calculateAverageRating = require("../../services/ratingUtils");

const shopPage = async (req, res) => {
  console.log(req.body);
  console.log(req.query);

  try {
    const id = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const categories = await Category.find({isActive:true});
    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });

    const items = await productSchema
      .find()
      .populate("category")
      .populate("roomtype")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await productSchema.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    res.render("User/shop", {
      items,
      currentPage: page,
      totalPages,
      totalCount,
      cart: cart,
      link: "/shop?page=",
      categories
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const shopSortingPage = async (req, res) => {
  const price = req.query.price; 

  try {
    const id = req.userId;
    const sortTerm = req.params.id;
    let linkTerm = req.params.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const categories = await Category.find({isActive:true});
    let sortQuery = {};
   let  searchQuery = {}
    switch (sortTerm) {
      case "newarrivals":
        sortQuery = { _id: -1 };
      linkTerm += '?'
        break;
      case "sortname":
        sortQuery = { name: 1 };
      linkTerm += '?'
        break;
      case "sortnameup":
        sortQuery = { name: -1 };
      linkTerm += '?'
        break;
      case "pricelowtohigh":
        sortQuery = { price: 1 };
      linkTerm += '?'
        break;
      case "pricehightolow":
        sortQuery = { price: -1 };
      linkTerm += '?'
        break;
      case "advancedSearch":
        const priceValues = price.split(/[;,]/);
        const minPrice = priceValues[0];
        const maxPrice = priceValues[1];
        searchQuery = {
          price: {
              $gte: minPrice,
              $lte: maxPrice
          }
      };
      linkTerm += '?price='+priceValues+'&'
          break;
      default:
        res.redirect("/shop");
        return;
    }

    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });
    

    const items = await productSchema
      .find(searchQuery)
      .populate("category")
      .populate("roomtype")
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalCount = await productSchema.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / limit);

    res.render("User/shop", {
      items,
      currentPage: page,
      totalPages,
      totalCount,
      cart: cart,
      link: `/shop/${linkTerm}page=`,
      categories,
      price
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .render("User/page-error", { error: "Internal Server Error" });
  }
};

const shopDetails = async (req, res) => {
  try {
    const id = req.userId;
    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });
    res.render("User/shopside", { cart: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const searchProduct = async (req, res) => {
  try {
    const findThis = req.query.searchValue;
    const regex = new RegExp(findThis, "i");
    const products = await productSchema.find({ name: regex });
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const landingPage = async (req, res) => {
  try {
    const id = req.userId;
    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });

    const categories = await Category.find({isActive:true});
    const roomTypes = await RoomType.find({isActive:true});
    const products = await productSchema
      .find({ status: true })
      .populate("category")
      .populate("roomtype")
      .exec();

    res.render("User/index", {
      productdata: products,
      categories: categories,
      roomtype: roomTypes,
      cart: cart,
    });
  } catch (error) {
    console.log(error);
    res.render("User/page-error", { error: error.message });
  }
};

const productPage = async (req, res) => {
  try {
    const productId = req.params.id;
    const id = req.userId;
    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });

    const category = await Category.find();
    const roomType = await RoomType.find();
    const product = await productSchema
      .findById(productId)
      .populate("category")
      .populate("roomtype")
      .exec();
      if(product){
    const averageRating = calculateAverageRating(product);

    const relatedProducts = await productSchema
      .find({
        category: product.category._id,
        _id: { $ne: product._id },
      })
      .limit(4)
      .skip({ _id: product._id });
    console.log(averageRating, product);
    res.render("User/product", {
      productdata: product,
      category: category,
      roomtype: roomType,
      cart: cart,
      items: relatedProducts,
      rating: averageRating,
    });}
    else{
      res.redirect('/shop')
    }
  } catch (error) {
    console.log(error);
    res.render("User/page-error", { error: error.message });
  }
};

const categoryPage = async (req, res) => {
  try {
    const ids = req.params.id;
    const id = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });

    const items = await productSchema
      .find({ category: ids })
      .populate("category")
      .populate("roomtype")
      .skip((page - 1) * limit)
      .limit(limit);
if(items){
    const totalCount = await productSchema.countDocuments({ category: ids });
    const totalPages = Math.ceil(totalCount / limit);

    res.render("User/shop", {
      items,
      currentPage: page,
      totalPages,
      totalCount,
      cart: cart,
      link: `/category/${ids}?page=`,
    });
  }
  else{
    res.redirect('/')
  }
  } catch (error) {
    console.log(error);
    
    res.redirect('/')
  }
};

const roomTypePage = async (req, res) => {
  try {
    const ids = req.params.id;
    const id = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const cart = await cartSchema.findById(id).populate({
      path: "products",
      populate: { path: "product", model: "products" },
    });

    const items = await productSchema
      .find({ roomtype: ids })
      .populate("category")
      .populate("roomtype")
      .skip((page - 1) * limit)
      .limit(limit);
if(items){
    const totalCount = await productSchema.countDocuments({ roomtype: ids });
    const totalPages = Math.ceil(totalCount / limit);

    res.render("User/shop", {
      items,
      currentPage: page,
      totalPages,
      totalCount,
      cart: cart,
      link: `/roomtype/${ids}?page=`,
    });
  }
  else{
    res.redirect('/')
  }
  } catch (error) {
    console.log(error);
    // res.status(500).send("Internal Server Error");
    res.redirect('/')
  }
};

const rating = async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const itemDocument = await item.findById(itemId);
    itemDocument.rating = req.body.rating;
    await itemDocument.save();
    const productId = itemDocument.product;
    await products.findByIdAndUpdate(productId, {
      $push: { rating: req.body.rating },
    });

    return res.json({
      status: "Success",
      message: "Thank You for rating us",
      rated: true,
    });
  } catch (error) {}
};

module.exports = {
  shopPage,
  shopSortingPage,
  shopDetails,
  searchProduct,
  landingPage,
  productPage,
  categoryPage,
  roomTypePage,
  rating,
};
