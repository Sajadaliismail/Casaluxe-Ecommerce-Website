const Order = require("../../models/orderSchema");

const dailyChart = async (req, res) => {
  try {
    Order.aggregate([
      {
        $unwind: "$items"
      },
      {
        $lookup: {
          from: "items",
          localField: "items",
          foreignField: "_id",
          as: "item"
        }
      },
      {
        $unwind: "$item"
      },
      {
        $lookup: {
          from: "products",
          localField: "item.product",
          foreignField: "_id",
          as: "productdetails"
        }
      },
      {
        $unwind: "$productdetails"
      },
      {
        $group: {
          _id: "$item.product",
          productName: { $first: "$productdetails.name" },
          totalQuantity: { $sum: "$item.count" },
          totalRevenue: { $sum: { $multiply: ["$item.priceAfterDiscounts", "$item.count"] } }

        }
      },
    ]).then((data)=>{
      console.log(data);
    })
    const topProducts = await Order.aggregate([
      {
        $unwind: "$items"
      },
      {
        $lookup: {
          from: "items",
          localField: "items",
          foreignField: "_id",
          as: "item"
        }
      },
      {
        $unwind: "$item"
      },
      {
        $lookup: {
          from: "products",
          localField: "item.product",
          foreignField: "_id",
          as: "productdetails"
        }
      },
      {
        $unwind: "$productdetails"
      },
      {
        $group: {
          _id: "$item.product",
          productName: { $first: "$productdetails.name" },
          totalQuantity: { $sum: "$item.count" },
          totalRevenue: { $sum: { $multiply: ["$item.priceAfterDiscounts", "$item.count"] } }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0, 
          productName: 1, 
          totalQuantity: 1 ,
          totalRevenue: 1
        }
      }
    ]);
      
      
    const topCategory = await Order.aggregate([
      {
        $unwind: "$items" 
      },
      {
        $lookup: {
          from: "items", 
          localField: "items",
          foreignField: "_id",
          as: "item"
        }
      },
      {
        $unwind: "$item" 
      },
      {
        $lookup: {
          from: "products", 
          localField: "item.product",
          foreignField: "_id",
          as: "productdetails"
        }
      },
      {
        $unwind: "$productdetails" 
      },
      {
        $lookup: {
          from: "categories", 
          localField: "productdetails.category",
          foreignField: "_id",
          as: "Category"
        }
      },
      {
        $unwind: "$Category" 
      },
      {
        $group: {
          _id: "$Category._id", 
          CategoryIdInProduct: { $first: "$productdetails.category" },
          CategoryName: { $first: "$Category.name" },
          CategoryId: { $first: "$Category._id" },
          totalQuantity: { $sum: "$item.count" } ,
          totalRevenue: { $sum: { $multiply: ["$item.priceAfterDiscounts", "$item.count"] } }

        }
      },
      {
        $sort: { totalQuantity: -1 } 
      },
      {
        $limit: 10 
      },
      {
        $project: {
          _id: 0, 
          CategoryIdInProduct: 1, 
          CategoryName: 1, 
          CategoryId: 1, 
          totalQuantity: 1 ,
          totalRevenue :1
        }
      }
    ]);
    
    const data = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ["canceled", "returned"] },
          orderdate: { $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
    {
        $group: {
          _id: {
            year: { $year: "$orderdate" },
            month: { $month: "$orderdate" },
            day: { $dayOfMonth: "$orderdate" }
          },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          totalAmountAfterDiscount: { $sum: "$totalAmountAfterDiscount"},
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day"
            }
          },
          totalOrders: 1,
          totalAmount: 1,
          totalAmountAfterDiscount: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({ success: true, data,topCategory,topProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const yearlyChart = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ["canceled", "returned"] }
        }
      },
     {
        $group: {
          _id: {
            year: { $year: "$orderdate" }
          },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          totalAmountAfterDiscount: { $sum: "$totalAmountAfterDiscount"},

        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          totalOrders: 1,
          totalAmount: 1,
          totalAmountAfterDiscount: 1

        }
      },
      { $sort: { year: 1 } }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const monthlyChart = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ["canceled", "returned"] }
        }
      },
    {
        $group: {
          _id: {
            year: { $year: "$orderdate" },
            month: { $month: "$orderdate" }
          },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          totalAmountAfterDiscount: { $sum: "$totalAmountAfterDiscount"},

        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalOrders: 1,
          totalAmount: 1,
          totalAmountAfterDiscount: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);
console.log(data);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const customChart = async (req, res) => {
  try {
   
    const { startDate, endDate } = req.query;

    
    const matchCriteria = {
      $match: {
        orderdate: {} ,
        orderStatus: { $nin: ["canceled", "returned"] }
      }
    };

    
    if (startDate) {
      matchCriteria.$match.orderdate.$gte = new Date(startDate);
    }

    if (endDate) {
      matchCriteria.$match.orderdate.$lte = new Date(endDate);
    }

    const data = await Order.aggregate([
      matchCriteria,
      {
        $group: {
          _id: {
            year: { $year: "$orderdate" },
            month: { $month: "$orderdate" },
            day: { $dayOfMonth: "$orderdate" }
          },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          totalAmountAfterDiscount: { $sum: "$totalAmountAfterDiscount"}
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day"
            }
          },
          totalOrders: 1,
          totalAmount: 1,
          totalAmountAfterDiscount: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


module.exports = {dailyChart,monthlyChart,yearlyChart,customChart}