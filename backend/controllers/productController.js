const Product = require("../models/productSchema");

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
      isMain
    } = req.body;
    const images = [];
    req.files.map((item, index) => {
      images.push({
        url:item.path,
        isMain: index == isMain ? true : false
      });
    });
    console.log(images);
    

    const slug = title.toLowerCase().split(" ").join("-");
    const existingSlug = await Product.findOne({ slug: slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }
    const sku = `eco-${Date.now()}`;
    const existingSku = await Product.findOne({ sku: sku });
    if (existingSku) {
      return res.status(400).json({
        success: false,
        message: "Sku already exists",
      });
    }

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
      message: `Internal server error : ${error}`,
    });
  }
};

module.exports = { createProductController };
