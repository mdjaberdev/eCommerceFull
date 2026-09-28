const express = require("express");
const { updateOwnProfileController, createCategoryController, allCategoryController, categoryUpdateController, categoryDeleteController } = require("../controllers/userController");

const router = express.Router()

router.post("/createcategory", createCategoryController);
router.post("/updateownprofile", updateOwnProfileController);
router.get("/allcategory", allCategoryController);
router.post("/categoryupdate/:id", categoryUpdateController);
router.delete("/categorydelete/:id", categoryDeleteController);


module.exports = router