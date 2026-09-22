require("node:dns").setServers(["1.1.1.1"], ["8.8.8.8"]);
require("dotenv").config();
const express = require("express");
const dbConnection = require("./config/dbConnection");
const router = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const vendorRouter = require("./routes/vendorRouter");
const { userMiddleware, adminMiddleware, vendorMiddleware } = require("./middlewares/roleMiddleware");
const app = express();
dbConnection();

app.use(express.json());

app.use("/api/v1/auth", router);
app.use("/api/v1/user", userMiddleware, userRouter);
app.use("/api/v1/admin",adminMiddleware, adminRouter);
app.use("/api/v1/vendor", vendorMiddleware, vendorRouter);

const port = process.env.DB_PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running ${port}`);
});
