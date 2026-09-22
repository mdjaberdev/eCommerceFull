const User = require("../models/userSchema");
const adminController = async (req, res) => {
  res.send("Hello admin");
};

const allUserController = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).json({
    success: true,
    message: `${users.length} users found`,
    data: users,
  });
};

const deleteUserController = async (req, res) => {
  const { id } = req.params;
  const deleteUser = await User.findByIdAndDelete(id);
  if (!deleteUser) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User deleted"
  })
};

module.exports = { adminController, allUserController, deleteUserController };
