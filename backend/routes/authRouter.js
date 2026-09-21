const express = require("express");
const { registrationController, verificationEmailController } = require("../controllers/authControllers");

const router = express.Router();

router.post("/registration", registrationController);
router.post("/verify/:token", verificationEmailController);




module.exports = router;
