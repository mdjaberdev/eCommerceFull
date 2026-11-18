const axios = require("axios");
const Cart = require("../models/cartSchema");
const Coupon = require("../models/couponSchema");

const paymentController = async (req, res) => {
  const {
    desc,
    cus_name,
    cus_email,
    cus_add1,
    cus_add2,
    cus_city,
    cus_state,
    cus_postcode,
    cus_phone,
    ownerId,
    coupon,
  } = req.body;

  const allCart = await Cart.find({ ownerId: ownerId }).populate("productId");
  let total = 0;
  allCart.map((item) => {
    if (item.productId.discountType == "percent") {
      const afterDiscount =
        (item.productId.price -
          (item.productId.price * item.productId.discountPrice) / 100) *
        item.quantity;
      total += afterDiscount;
    } else {
      if (item.productId.discountType == "fixed") {
        const afterDiscount =
          (item.productId.price - item.productId.discountPrice) * item.quantity;
        total += afterDiscount;
      }
    }
  });

  if (coupon) {
    const existingCoupon = await Coupon.findOne({ code: coupon });
    if (total < existingCoupon.couponType) {
      return res.status(400).json({
        success: false,
        message: `Please add at least ${existingCoupon.minimumAmount} taka to use this coupon.`,
      });
    }

    if (existingCoupon.couponType == "percent") {
      let afterTotal = (total * existingCoupon.couponAmount) / 100;
      total = total - afterTotal;
    } else {
      if (existingCoupon.couponType == "fixed") {
        total = total - existingCoupon.couponAmount;
      }
    }
  }

  console.log(total);
  try {
    const paymentData = {
      store_id: "aamarpaytest",
      tran_id: `eco-${Date.now()}`,
      success_url: "http://www.merchantdomain.com/successpage.html",
      fail_url: "http://www.merchantdomain.com/failedpage.html",
      cancel_url: "http://www.merchantdomain.com/cancelpage.html",
      amount: total,
      currency: "BDT",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      desc: desc,
      cus_name: cus_name,
      cus_email: cus_email,
      cus_add1: cus_add1,
      cus_add2: cus_add2,
      cus_city: cus_city,
      cus_state: cus_state,
      cus_postcode: cus_postcode,
      cus_country: "Bangladesh",
      cus_phone: cus_phone,
      type: "json",
    };

    const response = await axios.post(
      "https://sandbox.aamarpay.com/jsonpost.php",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Payment Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Payment initialization failed",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { paymentController };
