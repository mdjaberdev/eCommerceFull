require("node:dns").setServers(["1.1.1.1"], ["8.8.8.8"]);
require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./swagger");
const dbConnection = require("./config/dbConnection");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const vendorRouter = require("./routes/vendorRouter");
const {
  userMiddleware,
  adminMiddleware,
  vendorMiddleware,
} = require("./middlewares/roleMiddleware");
const swaggerSpec = require("./config/swagger");
const app = express();
dbConnection();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userMiddleware, userRouter);
app.use("/api/v1/admin", adminRouter);
// app.use("/api/v1/vendor",vendorMiddleware, vendorRouter);
app.use("/api/v1/vendor", vendorRouter);

const port = process.env.DB_PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running ${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});
