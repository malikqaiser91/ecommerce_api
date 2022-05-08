const Product = require('../models/Product');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');

// @desc    Create New Review And Update Review
// @route   PUT /api/v1/reviews
// @access  Private User
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  console.log(product.reviews);
  const isReviewed = product.reviews.find(
    (review) => review.name === req.user.name
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.name === req.user.name) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => {
      return item.rating + acc;
    }, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// @desc    Get all reviews for a specific reviews
// @route   GET /api/v1/reviews
// @access  Private User
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const products = await Product.findById(req.query.id);
  console.log('Hello World');
  res.status(200).json({
    success: true,
    reviews: products.reviews,
  });
});

// @desc    Delete product review
// @route   GET /api/v1/review/
// @access  Private User
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  const reviews = product.reviews.filter(
    (review) => review.id.toString() !== req.query.reviewId
  );
  console.log(reviews);
  const numOfReviews = reviews.length;
  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
      reviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
