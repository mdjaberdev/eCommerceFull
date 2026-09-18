const express = require("express");
const {
  registrationController,
  loginController,
  varificationemailController,
} = require("../controllers/authControllers");


const router = express.Router();

router.post("/registration", registrationController);
router.post("/login", loginController);
router.post("/varify/:token", varificationemailController);

module.exports = router;
