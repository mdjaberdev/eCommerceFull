require("node:dns").setServers(["1.1.1.1"], ["8.8.8.8"]);
require("dotenv").config();
const express = require("express");
const dbConnection = require("./config/dbConnection");
const router = require("./routes/authRouter");
const app = express();
dbConnection()

app.use(express.json());

app.use("/api/v1/auth", router)

const port = process.env.DB_PORT || 8000

app.listen(port, () => {
  console.log(`Server is running ${port}`);
});
