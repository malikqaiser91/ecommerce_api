const User = require('../models/User');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  ADMIN private
exports.getUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    users,
  });
});

// @desc    Get single user details
// @route   GET /api/v1/admin/user/:id
// @access  ADMIN private
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update user details
// @route   PUT /api/v1/admin/user/:id
// @access  ADMIN private
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    runValidators: true,
    new: true,
    useFindAndModify: true,
  });
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
  });
});

// @desc    Delete user
// @route   Delete /api/v1/admin/user/:id
// @access  ADMIN private
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});
