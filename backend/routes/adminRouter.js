const express = require("express");
const { adminController, allUserController, deleteUserController, singleUserController, activeUserController, deActiveUserController, updateUserController } = require("../controllers/adminController");

const router = express.Router();

router.post("/delete/vendor", adminController);
router.get("/all-users", allUserController);
router.delete("/deleteuser/:id", deleteUserController);
router.get("/singleuser/:id", singleUserController);
router.get("/activeuser", activeUserController);
router.get("/deactiveuser", deActiveUserController);
router.post("/updateuser/:id", updateUserController);


module.exports = router;
