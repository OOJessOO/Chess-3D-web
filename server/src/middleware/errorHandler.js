import HttpError from '../utils/errors.js';

export const notFound = (_req, _res, next) => {
  next(new HttpError(404, 'NOT_FOUND'));
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: {
      code,
      message: err.message,
      ...(err.meta ? { meta: err.meta } : {})
    }
  });
};
