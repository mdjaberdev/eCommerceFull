
const express = require("express");
const {
  updateOwnProfileController,
  createCategoryController,
  allCategoryController,
  categoryUpdateController,
  categoryDeleteController,
  subCategoryCreateController,
  allSubCategoryController,
  allCategorywiseSubCategoryController,
  allOwnerwiseCategoryController,
} = require("../controllers/vendorController");
const { createProductController } = require("../controllers/productController");

const router = express.Router();

// CATEGORY
router.post("/createcategory", createCategoryController);
router.post("/updateownprofile", updateOwnProfileController);
router.get("/allcategory", allCategoryController);
router.post("/categoryupdate/:id", categoryUpdateController);
router.delete("/categorydelete/:id", categoryDeleteController);
router.get("/allownerwisecategory/:id", allOwnerwiseCategoryController);

// SUBCATEGORY
router.post("/subcategorycreate", subCategoryCreateController);
router.get("/allsubcategory", allSubCategoryController);
router.get("/allcategorywisesubcategory/:id", allCategorywiseSubCategoryController);


// PRODUCT 
router.post("/createproduct", createProductController);

module.exports = router;