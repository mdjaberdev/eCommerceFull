const Product = require("../models/productSchema");
const Cart = require("../models/cartSchema");


// Create Cart
const createCartController = async (req, res) => {
  try {
    const { productId, quantity = 1, ownerId } = req.body;
    if (!productId || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Data",
      });
    }
    const existingPro = await Product.findById({ _id: productId });
    const existingCart = await Cart.findOne({
      productId: productId,
      ownerId: ownerId,
    });

    console.log(existingCart);
    if (existingCart) {
      const total = existingCart.quantity + quantity;
      if (total > existingPro.stock) {
        return res.status(400).json({
          success: false,
          message: "This product is out of stock.",
        });
      }

      existingCart.quantity = existingCart.quantity + quantity;
      existingCart.save();
      return res.status(201).json({
        success: true,
        message: "Cart added",
      });
    }

    if (existingPro.stock >= quantity) {
      const saveCart = new Cart({
        productId,
        quantity,
        ownerId,
      });
      await saveCart.save();
      return res.status(201).json({
        success: true,
        message: "Cart added",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "This product is out of stock.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};


// Incremeant Decremeant Cart
const increDecreController = async (req, res) => {
  const { cartId, quantity, ownerId, type } = req.body;
  const existingCart = await Cart.findById({
    _id: cartId,
  }).populate("productId");

  if (!existingCart) {
    return res.status(400).json({
      success: false,
      message: "Cart not found",
    });
  }
  if (type == "plus") {
    const total = existingCart.quantity + 1;
    if (total > existingCart.productId.stock) {
      return res.status(400).json({
        success: false,
        message: "This product is out of stock",
      });
    } else {
      existingCart.quantity = total;
    }
  }

  if (type == "minus") {
    existingCart.quantity = existingCart.quantity - 1;
    if (existingCart.quantity < 1) {
      await Cart.findByIdAndDelete(cartId);
      return res.status(200).json({
        success: true,
        message: "The product has been deleted form the cart",
      });
    }
  }

  existingCart.save();
  return res.status(200).json({
    success: true,
    message: "Cart updated",
  });
};


// Get Owner Wise Cart
const getOwnerCartsController = async (req, res) => {
  const { ownerId } = req.body;
  const carts = await Cart.find({ ownerId }).populate("productId");

  if (!carts || carts.length == 0) {
    return res.status(404).json({
      success: false,
      message: "Cart is empty",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Owner product",
    count: carts.length,
    data: carts,
  });
};
module.exports = {
  createCartController,
  increDecreController,
  getOwnerCartsController,
};
