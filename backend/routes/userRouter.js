const express = require("express");
const router = express.Router()
const { singleProductController, getAllProductController } = require("../controllers/productController");
const { allCategoryController, allSubCategoryController } = require("../controllers/vendorController");
const { createCartController, increDecreController, getOwnerCartsController } = require("../controllers/cartController");
const { paymentController } = require("../controllers/paymentController");


// Get Category 
router.get("/allcategory", allCategoryController);

// Get SubCategory 
router.get("/allsubcategory", allSubCategoryController);

// Get Product 
router.get("/getallproduct", getAllProductController);
router.get("/singleproductget/:slug", singleProductController);

// Create Cart
router.post("/createcart", createCartController);
router.post("/incredecrecart", increDecreController);
router.get("/getownercats", getOwnerCartsController);


// Payment 
router.post("/payment", paymentController);



module.exports = router