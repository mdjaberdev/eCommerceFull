const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      // required: true,
      // unique: true,
    },
    description: {
      type: String,
    },
    ShortDescription: {
      type: String,
    },

    sku: {
      type: String,
      // required: true,
      // unique: true,
    },
    slug: {
      type: String,
      // required: true,
      // unique: true,
    },
    price: {
      type: Number,
      // required: true,
    },
    images: [
      {
        url: {
          type: String,
        },
        isMain: {
          type: Boolean,
          default: false,
        },
      },
    ],
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
    },
    discountPrice: {
      type: Number,
    },
    discountDate: {
      type: Date,
    },
    stock: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
