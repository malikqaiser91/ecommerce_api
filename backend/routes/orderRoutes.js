const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');
const {
  createOrder,
  singleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

router.route('/me').get(isAuthenticated, myOrders);

router
  .route('/')
  .post(isAuthenticated, createOrder)
  .get(isAuthenticated, authorizeRoles('admin'), allOrders);

router
  .route('/:id')
  .get(isAuthenticated, singleOrder)
  .put(isAuthenticated, authorizeRoles('admin'), updateOrder)
  .delete(isAuthenticated, authorizeRoles('admin'), deleteOrder);

module.exports = router;
