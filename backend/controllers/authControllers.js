const User = require("../models/userSchema");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verificationEmail } = require("../utils/emailSender");

const registrationController = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, terms } = req.body;

    if (!fullName || !email || !password || !confirmPassword || !terms) {
      return res.status(400).json({
        success: false,
        message: "Please fill the all feilds",
      });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid password",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm password not match",
      });
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      fullName: fullName,
      email: email,
      password: hashPassword,
    });

    const saveUser = await user.save();
    const verificationToken = jwt.sign(
      {
        _id: saveUser._id,
        email: saveUser.email,
        password: saveUser.password,
        role: saveUser.role,
      },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: "30d" },
    );

    verificationEmail(email, verificationToken);
    return res.status(201).json({
      success: true,
      message: "Registration successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const verificationEmailController = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please enter your token",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
  console.log(decoded);
  await User.findByIdAndUpdate({ _id: decoded._id }, { isVerified: true });
  return res.status(200).json({
    success: true,
    message: "Verified your account",
  });
};

module.exports = {
  registrationController,
  verificationEmailController,
};
