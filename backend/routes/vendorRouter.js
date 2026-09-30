
const express = require("express");
const {
  updateOwnProfileController,
  createCategoryController,
  allCategoryController,
  categoryUpdateController,
  categoryDeleteController,
} = require("../controllers/vendorController");

const router = express.Router();

// CATEGORY
router.post("/createcategory", createCategoryController);
router.post("/updateownprofile", updateOwnProfileController);
router.get("/allcategory", allCategoryController);
router.post("/categoryupdate/:id", categoryUpdateController);
router.delete("/categorydelete/:id", categoryDeleteController);

// SUBCATEGORY
router.post("/subcategorycreate")

module.exports = router;