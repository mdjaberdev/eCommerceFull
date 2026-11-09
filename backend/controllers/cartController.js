const Product = require("../models/productSchema");
const Cart = require("../models/cartSchema");
const createCartController = async (req, res) => {
  try {
    const { productId, quantity = 1, ownerId } = req.body;
    if (!productId || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Data",
      });
    }

    const existingPro = await Product.findOne({ _id: productId });
    if (existingPro.stock >= quantity) {
      console.log("Product ase");
      const saveCart = new Cart({
        productId,
        quantity,
        ownerId,
      });

      await saveCart.save();

      return res.status(201).json({
        success: true,
        message: "cart added",
      });
    } else {
      console.log("Product nai");
      return res.status(400).json({
        success: false,
        message: "Out of stock",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internaql server error : ${error.message}`,
    });
  }
};

module.exports = { createCartController };
