const ErrorHandler = require('../utils/ErrorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.errorCode || 500;

  // Caste Error
  if (err.name === 'CastError') {
    const message = `Resource not found, Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Handling Mongoose Validation Error

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);

    err = new ErrorHandler(message, 400);
  }

  // Handling Mongoose duplicate key erros
  if (err.code === 11000) {
    const message = `Duplicated ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Handling Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `JSON Web Token is invalid, Try Again!!`;
    err = new ErrorHandler(message, 400);
  }

  // Handling Expire JWT error
  if (err.name === 'TokenExpiredError') {
    const message = `JSON Web Token is expired`;
    err = new ErrorHandler(message, 400);
  }

  process.env.NODE_ENV === 'DEVELOPMENT'
    ? res.status(err.statusCode).json({
        success: false,
        message: err.message,
      })
    : res.status(err.statusCode).json({
        success: false,
        err,
        errMessage: err.message || 'Internal Server Error',
        stack: err.stack,
      });
  // if (process.env.NODE_ENV == 'DEVELOPMENT') {
  //   console.log('asdasd');
  //   res.status(err.statusCode).json({
  //     success: false,
  //     err,
  //     errMessage: err.message || 'Interval Server Error',
  //     stack: err.stack,
  //   });
  // }
  // if (process.env.NODE_ENV === 'PRODUCTION') {
  //   let error = { ...err };
  //   error.message = err.message;
  //   res.status(error.statusCode).json({
  //     success: false,
  //     message: error.message || 'Interval Server Error',
  //   });
  // }
};
