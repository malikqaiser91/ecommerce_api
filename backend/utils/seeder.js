const Product = require('../models/Product');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const products = require('../data/product.json');

// setting dot env file
dotenv.config({ path: './backend/config/config.env' });

connectDB();

const insertProduct = async () => {
  try {
    await Product.deleteMany({});
    console.log('Products deleted successfully');
    await Product.insertMany(products, { validateBeforeSave: false });
    console.log('Products inserted successfully');
    process.exit(1);
  } catch (error) {
    const { message } = error;
    console.log(message);
    process.exit(1);
  }
};

insertProduct();
