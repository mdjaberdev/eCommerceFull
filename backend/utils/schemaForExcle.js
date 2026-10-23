const schema = {
  title: {
    column: "title",
    type: String,
    required: true,
  },
  description: {
    column: "description",
    type: String,
  },
  ShortDescription: {
    column: "ShortDescription",
    type: String,
  },
  sku: {
    column: "sku",
    type: String,
  },
  slug: {
    column: "slug",
    type: String,
  },
  price: {
    column: "price",
    type: Number,
    required: true,
  },
  discountPrice: {
    column: "discountPrice",
    type: Number,
  },
  stock: {
    column: "stock",
    type: Number,
  },
  status: {
    column: "status",
    type: String,
    default: "pending",
  },

  images: {
    column: "images",
    type: String,
  },
};

module.exports = schema;
