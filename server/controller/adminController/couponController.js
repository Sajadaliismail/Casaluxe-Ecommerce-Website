
const couponSchema = require('../../models/couponSchema')
const mongoose = require("mongoose");
const { MongoError } = require("mongodb");


const createCoupon = async (req, res) => {
  const {
      name,
      description,
      code,
      discount,
      minAmount,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      couponType,
      products,
      categories,
      status
  } = req.body;

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  try {
    if (!name.trim() || !code.trim() || !discount || !minAmount || !startDate || !endDate || !usageLimit) {
      return res.json({ status: 'error', message: 'Required fields contain only blank spaces',filled:true });
  }
      const coupon = new couponSchema({
          name,
          description,
          code,
          discount,
          minAmount,
          maxDiscount,
          startDate,
          endDate: end,
          products: couponType === 'products' ? products : null,
          categories: couponType === 'categories' ? categories : null,
          usageLimit,
          status
      });
      
      await coupon.save();
      res.status(200).json({ status: 'success', message: 'Coupon created successfully', success:true });
  } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log(error);
          // Handle validation errors
          return res.json({ status: 'error', message: 'Validation error', validation:true });
      } 
        else if (error && error.code === 11000) {
        return res.json({ status: "failed", message: "Duplicate entry", duplicate: true });
    } 
     else {
          console.error(error.message,'Error creating coupon:', error);
          return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
   
  }
};


const couponEdit = async (req,res)=>{
  console.log(req.body)
  const {
    coupnId,
    name,
    description,
    code,
    discount,
    minAmount,
    maxDiscount,
    startDate,
    endDate,
    usageLimit,
    couponType,
    products,
    categories,

} = req.body;
const end =  new Date(endDate)
end.setHours(23, 59, 59, 999);
try {

  if (!name.trim() || !code.trim() || !discount || !minAmount || !startDate || !endDate || !usageLimit) {
    return res.json({ status: 'error', message: 'Required fields contain only blank spaces',filled:true });
}
  console.log(coupnId);
  await couponSchema.findByIdAndUpdate(coupnId,{
    name,
    description,
    code,
    discount,
    minAmount,
    maxDiscount,
    startDate,
    endDate:end,
    products: couponType === 'products' ? products : null,
    categories: couponType === 'categories' ? categories : null,
    usageLimit,
    updatedAt: Date.now()
  },{
    runValidators: true,
    new: true,
  })
 return res.status(200).json({ status: 'success', message: 'Coupon created successfully', success:true });
} catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.log(error);
        // Handle validation errors
        return res.json({ status: 'error', message: 'Validation error', validation:true });
    } 
      else if (error && error.code === 11000) {
      return res.json({ status: "failed", message: "Duplicate entry", duplicate: true });
  } 
   else {
        console.error(error.message,'Error creating coupon:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
 
}
}
const blockCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    const coupon = await couponSchema.findById(id)
    await couponSchema.findByIdAndUpdate(id,{
      $set: { status: !coupon.status }}
    ).then((data) => {
      if (!data) {
        res.status(404).send({ message: `Cannot block with id ${id}` });
      } else {
        res.send({ message: "Successfull" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: `could not perform action ${id}` });
  }
};


module.exports = {  
  createCoupon,
  couponEdit,
  blockCoupon}