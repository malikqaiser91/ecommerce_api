const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/adminControllers');

router.route('/users').get(isAuthenticated, authorizeRoles('admin'), getUsers);

router
  .route('/user/:id')
  .get(isAuthenticated, authorizeRoles('admin'), getUser)
  .put(isAuthenticated, authorizeRoles('admin'), updateUser)
  .delete(isAuthenticated, authorizeRoles('admin'), deleteUser);

module.exports = router;
