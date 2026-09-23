const express = require("express");
const { userController, updateOwnProfileController, createCategoryController, allCategoryCobtroller, categoryUpdateController, categoryDeleteController } = require("../controllers/userController");

const router = express.Router()

router.get("/product", userController);
router.post("/updateownprofile", updateOwnProfileController);
router.post("/createcategory", createCategoryController);
router.get("/allcategory", allCategoryCobtroller);
router.post("/categoryupdate/:id", categoryUpdateController);
router.delete("/categorydelete/:id", categoryDeleteController);


module.exports = router