const express = require('express');
const router = express.Router();

const {
  createReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

router
  .route('/')
  .put(isAuthenticated, createReview)
  .get(isAuthenticated, getProductReviews)
  .delete(isAuthenticated, deleteReview);

module.exports = router;
