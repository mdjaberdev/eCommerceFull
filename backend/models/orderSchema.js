const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  tran_id: {
    type: String,
    required: true,
    unique: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  amount: Number,
  coupon: String,
  desc: String,
  products: [],
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending",
  },
});

module.exports = mongoose.model("Order", orderSchema);
