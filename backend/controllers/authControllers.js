const User = require('../models/User');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const sendEmail = require('../utils/sendEmail');
const sendToken = require('../utils/jwtToken');

const crypto = require('crypto');

// @desc    Register new user
// @route   POST /api/v1/users
// @access  Public
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'asdasd123123123123123123asdas',
      url: 'https://assdasdasd.comasdasdasdasd',
    },
  });

  sendToken(user, 200, res);
});

// @desc    Login  user
// @route   POST /api/v1/users/login
// @access  Public
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email & password', 400));
  }

  // Finding user in database
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  // Check if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  sendToken(user, 200, res);
});

// @desc    Logout  user
// @route   GET /api/v1/users/logout
// @access  Private
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

// @desc    Forget Password
// @route   POST /api/v1/users/forget
// @access  Public
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler(`User not found with this email`, 404));
  }

  //  Get reset token
  const resetToken = user.getResetToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset/${resetToken}`;

  // Message to send
  const message = `Your password reset token is as follows:\n\n
    ${resetUrl}
    if you have not requested it , then ignore it
  `;
  try {
    await sendEmail({
      email: user.email,
      subject: 'ShopIT Password Recovery',
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to: ${user.email}`,
    });
  } catch (error) {
    const { message } = error;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(message, 500));
  }
});

// @desc    Reset Password
// @route   POST /api/v1/users/reset/:token
// @access  Public
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL Token

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gte: Date.now(),
    },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        'Password reset token is invalid or has been expired',
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});
