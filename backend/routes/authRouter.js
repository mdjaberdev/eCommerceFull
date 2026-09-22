const express = require("express");
const { registrationController, verificationEmailController, loginController, forgotPasswordController, resetPasswordController } = require("../controllers/authControllers");

const router = express.Router();

router.post("/registration", registrationController);
router.post("/verify/:token", verificationEmailController);
router.post("/login", loginController);
router.post("/forgotPassword", forgotPasswordController);
router.post("/resetPassword/:token", resetPasswordController);





module.exports = router;
