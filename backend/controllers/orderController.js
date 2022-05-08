const Order = require('../models/Order');
const Product = require('../models/Product');

const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    piadAt: Date.now(),
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// @desc    Get single order
// @route   GET /api/v1/order/:id
// @access  Private
exports.singleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (!order) {
    return next(new ErrorHandler(`No order found with this ID`, 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// @desc    Get loggedIn user orders
// @route   GET /api/v1/orders/me
// @access  Private
exports.myOrders = catchAsyncError(async (req, res, next) => {
  console.log('Hello World');
  const orders = await Order.find({ user: req.user.id });
  if (!orders) {
    return next(
      new ErrorHandler(`No order of the current logged in user`, 400)
    );
  }
  res.status(200).json({
    success: true,
    orders,
  });
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  ADMIN Private
exports.allOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({});

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// @desc    Update  orders
// @route   PUT /api/v1/order/:id
// @access  ADMIN Private
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus === 'delivered') {
    return next(new Error('You have already delivered this order'), 400);
  }
  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });
  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}

// @desc    Delete order
// @route   DELETE /api/v1/order/:id
// @access  ADMIN Private
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler('No order found with this ID', 404));
  }
  await order.remove();
  res.status(200).json({
    success: true,
    message: 'Order deleted successfulluy',
  });
});
