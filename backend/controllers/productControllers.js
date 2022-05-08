const Product = require('../models/Product');
const APIFeatures = require('../utils/apiFeature');

const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');

// @desc    Create new product
// @route   POST /api/v1/products
// @access  private ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// @desc    Get all products
// @route   GET /api/v1/products
// @access  public
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 1;
  const productCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    products,
  });
});

// @desc    Get Single product
// @route   GET /api/v1/products/:id
// @access  public
exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  private ADMIN
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// @desc    Delete Product
// @route   Delete /api/v1/products/:id
// @access  private ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }
  await product.remove();

  res.status(200).json({
    success: true,
    message: 'Product is deleted',
  });
});
