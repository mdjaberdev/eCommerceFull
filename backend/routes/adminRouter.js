const express = require("express");
const { adminController, allUserController, deleteUserController } = require("../controllers/adminController");

const router = express.Router();

router.post("/delete/vendor", adminController);
router.get("/all-users", allUserController);
router.get("/deleteUser", deleteUserController);

module.exports = router;
