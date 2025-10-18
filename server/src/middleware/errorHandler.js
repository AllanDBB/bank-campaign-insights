const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  const response = {
    success: false,
    message: err.message || 'Internal server error'
  };

  if (isDevelopment) {
    response.error = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
