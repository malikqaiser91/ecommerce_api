const User = require('../models/User');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken');

// @desc    Get currently loggedIn user details
// @route   /api/v1/users/me
// @access  Private
exports.getMe = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update password of loggedIn user
// @route   /api/v1/users/updatepassword
// @access  Private
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // check previous user password

  const isMatched = await user.comparePassword(req.body.oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler(`Old password is not correct`, 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// @desc    Update profile of currently loggedIn user
// @route   /api/v1/users/me
// @access  Private
exports.updateMe = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar: TODO

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    runValidators: true,
    new: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: false,
    message: 'User data updated successfully',
  });
});
