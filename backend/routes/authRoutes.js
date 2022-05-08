const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
} = require('../controllers/authControllers');

router.route('/').post(registerUser);

router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

// Forget and Reset Password
router.route('/forget').post(forgetPassword);
router.route('/reset/:token').post(resetPassword);

module.exports = router;
