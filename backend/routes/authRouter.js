const express = require("express");
const { registrationController, verificationEmailController, loginController } = require("../controllers/authControllers");

const router = express.Router();

router.post("/registration", registrationController);
router.post("/verify/:token", verificationEmailController);
router.post("/login", loginController);




module.exports = router;
