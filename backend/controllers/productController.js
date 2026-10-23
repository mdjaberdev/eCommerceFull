const Product = require("../models/productSchema");
const schema = require("../utils/schemaForExcle");
const { readSheet } = require("read-excel-file/node");


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
      message: `Category wise Product`,
      count: categoryWisePro.length,
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
      message: `SubCategory wise Product`,
      count: subCategoryWisePro.length,
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
const ownerWiseProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerWisePro = await Product.find({ owner: id });

    if (!ownerWisePro || ownerWisePro.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Owner wise Product`,
      count: ownerWisePro.length,
      ownerWisePro: ownerWisePro,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

// DELETE PRODUCT
const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletepro = await Product.findByIdAndDelete(id);

    if (!deletepro) {
      return res.status(400).json({
        success: false,
        message: "Product already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

// BULKPRODUCTUPLOAD 

const bulkProductUploadController = async (req, res) => {
  try {
    const { objects, errors } = await readSheet(req.file.path, {
      schema,
    });

    if (errors) {
      return res.status(400).json({
        success: false,
        message: "Excel parsing error",
        errors: errors,
      });
    }

    const products = objects.map((product) => {
      return {
        ...product,
        slug: product.slug
          ? product.slug
          : product.title.toLowerCase().split(" ").join("-"),
        sku: product.sku
          ? product.sku
          : `eco-${product.title.substring(0, 4)}-${Date.now()}`,
        images: [
          {
            url: product.images,
            isMain: false,
          },
        ],
      };
    });

    await Product.insertMany(products);

    res.status(201).json({
      success: true,
      message: "All product upload successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const exportProductsController = async (req, res) => {};

module.exports = {
  createProductController,
  getAllProductController,
  categoryWiseProductController,
  subCategoryWiseProductController,
  ownerWiseProductController,
  deleteProductController,
  bulkProductUploadController,
  exportProductsController,
};
