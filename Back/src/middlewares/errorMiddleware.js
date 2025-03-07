export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = err.response && err.response.status ? err.response.status : 500;
  res.status(status).send(err.message || 'Internal Server Error');
}
