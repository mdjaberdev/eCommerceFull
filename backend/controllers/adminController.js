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
  const activeUser = await User.find({ stattus: "active" }).select("-password");
  return res.status(200).json({
    success: true,
    message: "Active user info",
    data: activeUser,
  });
};
const deActiveUserController = async (req, res) => {
  const deactiveUser = await User.find({ stattus: "deactive" }).select(
    "-password",
  );
  return res.status(200).json({
    success: true,
    message: "Deactive user info",
    data: deactiveUser,
  });
};


const updateUserController = async (req, res) => {

    const {id} = req.params 
    const updateUser = await User.findByIdAndUpdate({_id: id}, req.body, {new: true})
     return res.status(200).json({
       success: true,
       message: "User updated"
     });
    
}

module.exports = {
  adminController,
  allUserController,
  deleteUserController,
  singleUserController,
  activeUserController,
  deActiveUserController,
  updateUserController,
};
