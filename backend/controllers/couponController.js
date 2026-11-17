const User = require("../models/userSchema")
const Coupon = require("../models/couponSchema")


const createCouponController = async (req, res) => {
 try {
   const { code, couponType, couponAmount, minimumAmount, ownerId } = req.body;

   const existingCoupon = await Coupon.findOne({ code: code });
   if (existingCoupon) {
     return res.status(400).json({
       success: false,
       message: "Coupon already exists",
     });
   }

   const user = await User.findOne({ _id: ownerId });

   console.log(user);
   

   if (user.role !== "vendor" && user.role !== "admin") {
     return res.status(403).json({
       success: false,
       message: "You are not authrized",
     });
   }

   const saveCoupon = new Coupon({
     code,
     couponType,
     couponAmount,
     minimumAmount: minimumAmount,
     ownerId,
   });

   await saveCoupon.save();

   res.status(201).json({
     success: true,
     message: "Create a coupon successfully",
   });
 } catch (error) {
   return res.status(500).json({
     success: false,
     message: `Internal server error: ${error.message}`,
   });
 }
}

module.exports = {createCouponController}