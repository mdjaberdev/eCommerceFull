const mongoose = require("mongoose");

const { Schema } = mongoose;
const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  couponType: {
    type: String,
    enum: ["percent", "fixed"],
  },
  couponAmount: {
    type: Number,
  },
  minimumAmount: {
    type: Number,
  },
  redeemCoustomars: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  ownerId:{
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Coupon",couponSchema);
