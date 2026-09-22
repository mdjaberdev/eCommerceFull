const express = require("express");
const { userController } = require("../controllers/userController");

const router = express.Router()

router.get("/product", userController);

module.exports = router