import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Something went wrong';
    let errors = [];

    // 1. Mongoose Validation Error
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation failed';
      errors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));
    } 
    // 2. Mongoose Cast Error (Invalid ObjectId)
    else if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ID format for field '${error.path}'`;
      errors = [{ field: error.path, message: `Invalid ObjectId: ${error.value}` }];
    } 
    // 3. MongoDB Duplicate Key Error
    else if (error.code === 11000) {
      statusCode = 409;
      const fieldName = Object.keys(error.keyValue || {})[0] || 'field';
      message = `A record with this ${fieldName} already exists`;
      errors = [{ field: fieldName, message: `Duplicate value: '${error.keyValue[fieldName]}'` }];
    } 
    // 4. JWT Verification Errors
    else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Not authorized, invalid token';
    } else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Access token expired';
    } 
    // 5. Multer File Upload Errors
    else if (error.name === 'MulterError') {
      statusCode = 400;
      message = `File upload error: ${error.message}`;
      errors = [{ field: error.field || 'image', message: error.message }];
    } 
    // 6. Generic File Type / Custom Upload Errors
    else if (error.message?.includes('only images are allowed') || error.message?.includes('Invalid file type')) {
      statusCode = 400;
      message = error.message;
    }
    // 7. Cloudinary specific API errors
    else if (error.http_code) {
      statusCode = error.http_code;
      message = `Media storage error: ${error.message}`;
    }

    if (statusCode === 500 && env.NODE_ENV === 'production') {
      message = 'Internal server error';
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  const isProduction = env.NODE_ENV === 'production';
  const responseMessage = (error.statusCode === 500 && isProduction) ? 'Internal server error' : error.message;

  const response = {
    success: false,
    message: responseMessage,
    errors: error.errors,
    ...(isProduction ? {} : { stack: error.stack }),
  };

  // Log error locally
  console.error(`[Error Middleware] ${error.statusCode} - ${error.message}`);
  if (error.errors && error.errors.length) {
    console.error('Details:', error.errors);
  }
  if (!isProduction && error.stack) {
    console.error(error.stack);
  }

  return res.status(error.statusCode).json(response);
};

export default errorHandler;

