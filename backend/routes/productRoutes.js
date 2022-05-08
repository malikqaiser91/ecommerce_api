const express = require('express');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productControllers');

// Only admin can create,edit and delete products

router.route('/').get(getProducts).post(isAuthenticated, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(isAuthenticated, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticated, authorizeRoles('admin'), deleteProduct);

module.exports = router;
