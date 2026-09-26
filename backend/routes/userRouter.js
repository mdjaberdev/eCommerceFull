const express = require("express");
const { userController, updateOwnProfileController, createCategoryController, allCategoryController, categoryUpdateController, categoryDeleteController } = require("../controllers/userController");

const router = express.Router()

router.get("/product", userController);
router.post("/createcategory", createCategoryController);
router.post("/updateownprofile", updateOwnProfileController);
router.get("/allcategory", allCategoryController);
router.post("/categoryupdate/:id", categoryUpdateController);
router.delete("/categorydelete/:id", categoryDeleteController);


module.exports = router