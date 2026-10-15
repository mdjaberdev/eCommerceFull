
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
const { createProductController, getAllProductController, categoryWiseProductController } = require("../controllers/productController");
const upload = require("../utils/multerStorage")

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
router.post("/createproduct", upload.array("photo"), createProductController);
router.get("/getallproduct", getAllProductController);
router.get("/categorywiseproduct/:id", categoryWiseProductController);

module.exports = router;