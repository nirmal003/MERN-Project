const createAsyncError = require("../middleware/createAsyncError");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

// Create Product -- Admin
exports.createProduct = createAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getALlProducts = createAsyncError(async (req, res, next) => {
  const resultPerPage = 10;
  const productCount = await Product.countDocuments();

  const ApiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await ApiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
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

  if (!product) next(new ErrorHandler("Product not found", 404));
  else {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
});

// Delete Product -- Admin
exports.deleteProduct = createAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) next(new ErrorHandler("Product not found", 404));
  else {
    await product.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
});

//  Create New Review or Update Review
exports.createProductReview = createAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = Number(rating)), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  const ratings = product.reviews.reduce((acc, rev) => {
    return acc + rev.rating;
  }, 0);

  product.ratings = ratings / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

//  Get All Reviews of a Product
exports.getProductReviews = createAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({ success: true, reviews: product.reviews });
});
