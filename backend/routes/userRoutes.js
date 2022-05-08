const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');

const {
  getMe,
  updatePassword,
  updateMe,
} = require('../controllers/userControllers');

router.route('/me').get(isAuthenticated, getMe).put(isAuthenticated, updateMe);

router.route('/updatepassword').put(isAuthenticated, updatePassword);

module.exports = router;
