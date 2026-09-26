const User = require("../models/userSchema");
const adminController = async (req, res) => {
  res.send("Hello admin");
};

const allUserController = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      message: `${users.length} users found`,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const singleUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await User.findOne({ _id: id }).select("-password");
    return res.status(200).json({
      success: true,
      message: "User info",
      data: singleUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const activeUserController = async (req, res) => {
  try {
    const activeUser = await User.find({ status: "active" }).select(
      "-password",
    );
    return res.status(200).json({
      success: true,
      message: "Active user info",
      data: activeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};
const deActiveUserController = async (req, res) => {
  try {
    const deactiveUser = await User.find({ status: "deactive" }).select(
      "-password",
    );
    return res.status(200).json({
      success: true,
      message: "Deactive user info",
      data: deactiveUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...updateData } = req.body;
    const updateUser = await User.findByIdAndUpdate({ _id: id }, updateData, {
      new: true,
    }).select("-password");
    return res.status(200).json({
      success: true,
      message: "User updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = {
  adminController,
  allUserController,
  deleteUserController,
  singleUserController,
  activeUserController,
  deActiveUserController,
  updateUserController,
};
