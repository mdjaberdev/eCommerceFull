
const express = require("express");
const {
  updateOwnProfileController,
  createCategoryController,
  categoryUpdateController,
  categoryDeleteController,
  subCategoryCreateController,
  allCategorywiseSubCategoryController,
  allOwnerwiseCategoryController,
} = require("../controllers/vendorController");
const { createProductController, categoryWiseProductController, subCategoryWiseProductController, ownerWiseProductController, deleteProductController, bulkProductUploadController, exportProductsController, updateProductController, } = require("../controllers/productController");
const upload = require("../utils/multerStorage")

const router = express.Router();

// CATEGORY
router.post("/createcategory", createCategoryController);
router.post("/updateownprofile", updateOwnProfileController);
router.post("/categoryupdate/:id", categoryUpdateController);
router.delete("/categorydelete/:id", categoryDeleteController);
router.get("/allownerwisecategory/:id", allOwnerwiseCategoryController);

// SUBCATEGORY
router.post("/subcategorycreate", subCategoryCreateController);
router.get("/allcategorywisesubcategory/:id", allCategorywiseSubCategoryController);


// PRODUCT 
router.post("/createproduct", upload.array("photo"), createProductController);
router.get("/categorywiseproduct/:id", categoryWiseProductController);
router.get("/subcategorywiseproduct/:id", subCategoryWiseProductController);
router.get("/ownerwiseproduct/:id", ownerWiseProductController);
router.post("/updateproduct/:id",upload.array("photo") ,updateProductController);
router.delete("/deleteproduct/:id", deleteProductController);
router.post("/bulkproductupload",upload.single('file'), bulkProductUploadController);
router.get("/bulkproductdownload", exportProductsController);


module.exports = router;