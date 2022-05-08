const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    default: 0.0,
    maxlength: [5, 'Product price cannot exceed 5 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
  },
  ratings: {
    type: Number,
    max: [5, 'rating max value is 5'],
    min: [1, 'rating min value is 1'],
    default: 1,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please select product category'],
    enum: {
      values: [
        'Electronics',
        'Cameras',
        'Laptop',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home',
      ],
      message: 'Please select correct category for product',
    },
  },
  seller: {
    type: String,
    required: [true, 'Please enter product seller'],
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxlength: [5, 'Procut name cannot exceed 5 characters'],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: [true, 'Please enter the user name'],
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
