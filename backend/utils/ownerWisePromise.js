const Category = require("../models/categorySchema");
const SubCategory = require("../models/subCategorySchema");

const getCategoriesByOwner = async (id) => {
  try {
    const categories = await Category.find({ owner: id })
      .populate("owner")
      .lean();

    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await SubCategory.find({
          parentcategory: category._id,
        });
        return { ...category, subCategory: subcategories };
      }),
    );

    return categoriesWithSubcategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

module.exports = getCategoriesByOwner;
