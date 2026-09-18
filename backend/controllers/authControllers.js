const User = require("../models/userSchema");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const varificationEmail = require("../utils/emailSender");

const registrationController = async (req, res) => {
  const { fullName, email, password, confirmPassword, terms } = req.body;
  if (!fullName || !email || !password || !!confirmPassword || !terms) {
    return res.status(400).json({
      success: false,
      message: "Please fill the all fields",
    });
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
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
      message:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, $, !, %).",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Confirm password not match",
    });
  }

  const hash = bcrypt.hashSync(password, 10);

  const user = new User({
    fullName: fullName,
    email: email,
    password: hash,
    terms: terms,
  });

  await user.save();

  const verificationToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  varificationEmail(email, verificationToken);

  return res.status(201).json({
    success: true,
    message: "Registration successfully",
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill the all fields",
    });
  }

  const existingUser = await User.findOne({ email: email });

  if (!existingUser) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const comparePassword = bcrypt.compareSync(password, existingUser.password);

  if (comparePassword) {
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  }
};

const varificationemailController = async (req, res) => {
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  await User.findByIdAndUpdate({ _id: decoded._id }, { isVerified: true });

  res.status(200).json({
    success: true,
    message: "Email varified",
  });
};

module.exports = {
  registrationController,
  loginController,
  varificationemailController,
};
