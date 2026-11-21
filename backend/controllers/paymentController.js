const axios = require("axios");
const Cart = require("../models/cartSchema");
const Coupon = require("../models/couponSchema");
const Order = require("../models/orderSchema");

// Create payment
const paymentController = async (req, res) => {
  try {
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

    if (
      !desc ||
      !cus_name ||
      !cus_email ||
      !cus_add1 ||
      !cus_city ||
      !cus_state ||
      !cus_postcode ||
      !cus_phone ||
      !ownerId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    const allCart = await Cart.find({ ownerId: ownerId })
      .populate("productId")
      .lean();
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
            (item.productId.price - item.productId.discountPrice) *
            item.quantity;
          total += afterDiscount;
        }
      }
    });

    if (coupon) {
      const existingCoupon = await Coupon.findOne({ code: coupon });
      if (total < existingCoupon.minimumAmount) {
        return res.status(400).json({
          success: false,
          message: `Please add at least ${existingCoupon.minimumAmount} taka to use this coupon.`,
        });
      }

      if (existingCoupon.couponType == "percent") {
        let afterTotal = (total * existingCoupon.couponAmount) / 100;
        total = total - afterTotal;
      } else if (existingCoupon.couponType == "fixed") {
        total = total - existingCoupon.couponAmount;
      }
    }

    console.log(total);
    const tran_id = `eco-${Date.now()}`;

    try {
      const paymentData = {
        store_id: process.env.AMARPAY_STORE_ID,
        tran_id: tran_id,
        success_url: "http://www.merchantdomain.com/successpage.html",
        fail_url: "http://www.merchantdomain.com/failedpage.html",
        cancel_url: "http://www.merchantdomain.com/cancelpage.html",
        amount: total,
        currency: "BDT",
        signature_key: process.env.AMARPAY_SIGNAYURE_KEY,
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

      const saveOrder = new Order({
        tran_id: tran_id,
        ownerId: ownerId,
        amount: total,
        coupon: coupon,
        desc: desc,
        products: allCart,
      });

      await saveOrder.save();
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);

      return res.status(500).json({
        success: false,
        message: "Payment initialization failed",
        error: error.response?.data || error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Payment Verify

const paymentVerifyController = async (req, res) => {
  try {
    const { tran_id, ownerId } = req.params;

    if (!tran_id || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "Please provide both tran_id and ownerId",
      });
    }
    const response = await axios.get(
      `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?request_id=${tran_id}&store_id=aamarpaytest&signature_key=dbb74894e82415a2f7ff0ec3a97e4183&type=json`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.pay_status == "Failed") {
      const data = await Order.findOneAndUpdate(
        { tran_id: tran_id },
        { status: "failed" },
      );
      return res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    }

    if (response.data.pay_status == "Successful") {
      const data = await Order.findOneAndUpdate(
        { tran_id: tran_id },
        { status: "paid" },
        { new: true },
      );
      if (data) {
        await Cart.deleteMany({ ownerId: ownerId });
      }
      res.status(200).json({
        success: true,
        message: "Payment Paid",
        order: data,
      });
    }
    return res.status(400).json({
      success: false,
      message: `Unhandled payment status: ${response.data.pay_status}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = { paymentController, paymentVerifyController };
