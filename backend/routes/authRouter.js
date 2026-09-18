const express = require("express");
const {
  registrationController,
  loginController,
  verificationemailController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/authControllers");


const router = express.Router();

router.post("/registration", registrationController);
router.post("/login", loginController);
router.post("/verify/:token", verificationemailController);
router.post("/forgetPassword", forgotPasswordController);
router.post("/resetpassword/:token", resetPasswordController);

module.exports = router;
