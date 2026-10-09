const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const subCategory = require("../models/subCategorySchema");
const {
  categoryCreateEmail,
  categoryUpdateEmail,
  categoryDeleteEmail,
} = require("../utils/emailSender");
const getCategoriesByOwner = require("../utils/ownerWisePromise");

// CATEGORY
const createCategoryController = async (req, res) => {
  try {
    const { name, owner } = req.body;

    const existingName = await Category.findOne({ name: name.toLowerCase() });
    if (existingName) {
      return res.status(400).json({
        success: false,
        message: "This category already exist",
      });
    }

    const category = new Category({
      name: name.toLowerCase(),
      owner: owner,
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
    const allCategory = await Category.find({}).populate("owner");
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

// SUBCATEGORY

const subCategoryCreateController = async (req, res) => {
  try {
    const { name, parentcategory } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please enter a subCategory",
      });
    }
    const existingSubCategory = await subCategory.findOne({
      name: name.toLowerCase(),
    });

    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: "This Subcategory already exist",
      });
    }

    const saveSubCategory = new subCategory({
      name: name.toLowerCase(),
      parentcategory,
    });

    await saveSubCategory.save();

    return res.status(201).json({
      success: true,
      message: "Created Subcategory",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const allSubCategoryController = async (req, res) => {
  try {
    const allSubCategory = await subCategory
      .find({})
      .populate("parentcategory");

    if (!allSubCategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All Subcategory",
      data: allSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const allCategorywiseSubCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const allCategorywiseSubCategory = await subCategory.find({
      parentcategory: id,
    });

    return res.status(200).json({
      success: true,
      message: "All Category wise Subcategory",
      data: allCategorywiseSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const allOwnerwiseCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const allOwnerwisecategory = await getCategoriesByOwner(id);

    if (!allOwnerwisecategory || allOwnerwisecategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found for this owner",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Owner wise Categories",
      data: allOwnerwisecategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

module.exports = {
  updateOwnProfileController,
  createCategoryController,
  allCategoryController,
  categoryUpdateController,
  categoryDeleteController,
  subCategoryCreateController,
  allSubCategoryController,
  allCategorywiseSubCategoryController,
  allOwnerwiseCategoryController,
};
