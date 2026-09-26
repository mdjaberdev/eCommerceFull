const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  terms: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "vendor"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "deactive"],
    default: "deactive",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
