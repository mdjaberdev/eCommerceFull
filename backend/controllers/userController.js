const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const { categoryCreateEmail, categoryUpdateEmail, categoryDeleteEmail } = require("../utils/emailSender");

const userController = async (req, res) => {
  res.send("Hello users");
};

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    const existingName = await Category.findOne({ name: name.toLowerCase() });
    if (existingName) {
      return res.status(400).json({
        success: false,
        message: "This category already exist",
      });
    }

    const category = new Category({
      name: name.toLowerCase(),
    });

    await category.save();
    const adminEmail = "mdjaber.dev@gmail.com";

    categoryCreateEmail(adminEmail, category.name);
    return res.status(201).json({
      success: true,
      message: "Created category",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const updateOwnProfileController = async (req, res) => {
  try {
    const authorizationToken = req.headers.authorization;
    let token = authorizationToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

    const updateUser = await User.findByIdAndUpdate(decoded._id, req.body, {
      new: true,
    });
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

const allCategoryController = async (req, res) => {
 try {
   const allCategory = await Category.find({});
   return res.status(200).json({
     success: true,
     message: "All category",
     data: allCategory,
   });
 } catch (error) {
   return res.status(500).json({
     success: false,
     message: `Internal server error: ${error.message}`,
   });
 }
};

const categoryUpdateController = async (req, res) => {
try {
  const { id } = req.params;
  const { name } = req.body;

  const categoryUpdate = await Category.findOneAndUpdate(
    { _id: id },
    { name: name },
    { new: true },
  );

  const adminEmail = "mdjaber.dev@gmail.com";

  categoryUpdateEmail(adminEmail, categoryUpdate.name);

  return res.status(200).json({
    success: true,
    message: "Category updated",
  });
} catch (error) {
  return res.status(500).json({
    success: false,
    message: `Internal server error: ${error.message}`,
  });
}
};
1
const categoryDeleteController = async (req, res) => {
 try {
   const { id } = req.params;

   const categoryDelete = await Category.findByIdAndDelete(id);

   const adminEmail = "mdjaber.dev@gmail.com";

   categoryDeleteEmail(adminEmail, categoryDelete.name);

   return res.status(200).json({
     success: true,
     message: "Category deleted",
   });
 } catch (error) {
   return res.status(500).json({
     success: false,
     message: `Internal server error: ${error.message}`,
   });
 }
};

module.exports = {
  userController,
  updateOwnProfileController,
  createCategoryController,
  allCategoryController,
  categoryUpdateController,
  categoryDeleteController,
};
