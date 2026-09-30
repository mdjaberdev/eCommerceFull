
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
} = require("../controllers/vendorController");

const router = express.Router();

// CATEGORY
router.post("/createcategory", createCategoryController);
router.post("/updateownprofile", updateOwnProfileController);
router.get("/allcategory", allCategoryController);
router.post("/categoryupdate/:id", categoryUpdateController);
router.delete("/categorydelete/:id", categoryDeleteController);

// SUBCATEGORY
router.post("/subcategorycreate", subCategoryCreateController);
router.get("/allsubcategory", allSubCategoryController);
router.get("/allcategorywisesubcategory/:id", allCategorywiseSubCategoryController);

module.exports = router;