import { ErrorResponse } from '../helpers/response.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.code === 11000) {
    const message = 'Duplicate Field Value';
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  if (err.message === 'jwt expired') {
    error = new ErrorResponse(error.message, 401);
  }
  console.log(`${req.hostname}${req.url}`, error);
  res.status(error.statusCode || 500).json({
    sucess: false,
    message: error.message || 'Server Error',
  });
};

export { errorHandler };
