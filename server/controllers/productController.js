const createAsyncError = require("../middleware/createAsyncError");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");

// Create Product -- Admin
exports.createProduct = createAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getALlProducts = createAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Detail
exports.getProductDetail = createAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) next(new ErrorHandler("Product not found", 404));
  else res.status(200).json({ success: true, product });
});

// Update Product -- Admin
exports.updateProduct = createAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product -- Admin
exports.deleteProduct = createAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
