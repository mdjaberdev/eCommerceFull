const express = require("express");
const router = express.Router()
const { singleProductController, getAllProductController } = require("../controllers/productController");
const { allCategoryController, allSubCategoryController } = require("../controllers/vendorController");
const { createCartController } = require("../controllers/cartController");


// Get Category 
router.get("/allcategory", allCategoryController);

// Get SubCategory 
router.get("/allsubcategory", allSubCategoryController);

// Get Product 
router.get("/getallproduct", getAllProductController);
router.get("/singleproductget/:slug", singleProductController);

// Create Cart
router.post("/createcart", createCartController);




module.exports = router