export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
}

export function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}


