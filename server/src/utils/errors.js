class HttpError extends Error {
  constructor(status, code, meta) {
    super(code);
    this.status = status;
    this.code = code;
    this.meta = meta;
  }
}

export const createError = (status, code, meta) => new HttpError(status, code, meta);
export default HttpError;
