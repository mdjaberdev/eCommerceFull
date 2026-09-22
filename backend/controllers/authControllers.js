const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const {
  verificationEmail,
  forgetPasswordEmail,
} = require("../utils/emailSender");

// REGISTRATION
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

// VERIFICATION
const verificationEmailController = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill the all feilds",
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
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Password not match",
      });
    }

    if (comparePassword) {
      const accessToken = jwt.sign(
        {
          _id: existingUser._id,
          email: existingUser.email,
          password: existingUser.password,
          role: existingUser.role,
        },
        process.env.JWT_SECRET_ACCESS,
        { expiresIn: "30d" },
      );

      return res.status(200).json({
        success: true,
        message: "Login successfully",
        data: {
          _id: existingUser._id,
          fullName: existingUser.fullName,
          email: existingUser.email,
          role: existingUser.role,
        },
        accessToken: accessToken,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// FORGOTpASSWORD
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter a email",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const resetPasswordToken = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        password: existingUser.password,
      },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: "30d" },
    );
    forgetPasswordEmail(email, resetPasswordToken);
    return res.status(200).json({
      success: true,
      message: "Please check your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// RESETpASSWORD
const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please enter your token",
      });
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter your token",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm password not match",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
    const hashPassword = bcrypt.hashSync(newPassword, decoded.password);
    console.log(decoded);
    await User.findByIdAndUpdate(
      { _id: decoded._id },
      { password: hashPassword },
    );

    if (!decoded || !decoded._id) {
      return res.status(400).json({
        success: false,
        message: "Your token or id not match",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Password updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = {
  registrationController,
  verificationEmailController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
};
