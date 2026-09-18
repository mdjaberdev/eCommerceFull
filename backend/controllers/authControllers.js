const User = require("../models/userSchema");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verificationEmail, forgetPassEmail } = require("../utils/emailSender");

// registartion
const registrationController = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, terms } = req.body;
    if (!fullName || !email || !password || !confirmPassword || !terms) {
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

    verificationEmail(email, verificationToken);

    return res.status(201).json({
      success: true,
      message: "Registration successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// login
const loginController = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// emailVarify
const verificationemailController = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate({ _id: decoded._id }, { isVerified: true });

    res.status(200).json({
      success: true,
      message: "Email varified",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// forgetPassword

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please fiil the gap",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }

    const forgetPasswordToken = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    await forgetPassEmail(email, forgetPasswordToken);

    res.status(200).json({
      success: true,
      message: "Please check your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// resetPassword
const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password not matched",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashPass = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate({ _id: decoded._id }, { password: hashPass });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "invalid or expired token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registrationController,
  loginController,
  verificationemailController,
  forgotPasswordController,
  resetPasswordController,
};
