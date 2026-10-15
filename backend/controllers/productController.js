const Product = require("../models/productSchema");

// CREATE PRODUCT
const createProductController = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      price,
      discountPrice,
      categoryId,
      subCategoryId,
      ownerId,
      isMain,
    } = req.body;

    if (
      !title ||
      !description ||
      !shortDescription ||
      !price ||
      !discountPrice ||
      !categoryId ||
      !subCategoryId ||
      !ownerId ||
      !isMain
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill the all fields",
      });
    }

    //   IMAGES
    const images = [];
    req.files.map((item, index) => {
      images.push({
        url: item.path,
        isMain: index == isMain ? true : false,
      });
    });

    const slug = title.toLowerCase().split(" ").join("-");
    const existingSlug = await Product.findOne({ slug: slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }
    const sku = `eco-${Date.now()}`;
    // const existingSku = await Product.findOne({ sku: sku });
    // if (existingSku) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Sku already exists",
    //   });
    // }

    const product = new Product({
      title: title,
      description: description,
      shortDescription: shortDescription,
      price: price,
      discountPrice: discountPrice,
      category: categoryId,
      subCategory: subCategoryId,
      owner: ownerId,
      slug: slug,
      sku: sku,
      images: images,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created",
      product: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

// ALL PRODUCT

const getAllProductController = async (req, res) => {
  try {
    const allProduct = await Product.find({}).populate([
      "category",
      "subCategory",
      "owner",
    ]);
    return res.status(200).json({
      success: true,
      message: "All product",
      count: allProduct.length,
      allProduct: allProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

// CATEGORY WISE PRODUCT
const categoryWiseProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryWisePro = await Product.find({ category: id }).populate([
      "category",
      "subCategory",
      "owner",
    ]);

    if (!categoryWisePro || categoryWisePro.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${categoryWisePro.length} Category wise Product`,
      categoryWisePro: categoryWisePro,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

// SUBCATEGORY WISE PRODUCT
const subCategoryWiseProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryWisePro = await Product.find({ subCategory: id });

    if (!subCategoryWisePro || subCategoryWisePro.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${subCategoryWisePro.length} SubCategory wise Product`,
      subCategoryWisePro: subCategoryWisePro,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

// OWNER WISE PRODUCT

module.exports = {
  createProductController,
  getAllProductController,
  categoryWiseProductController,
  subCategoryWiseProductController,
  ownerWiseProductController,
  deleteProductController,
};
