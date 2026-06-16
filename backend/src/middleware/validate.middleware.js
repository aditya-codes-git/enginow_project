import ApiError from '../utils/ApiError.js';

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;
      
      next();
    } catch (error) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.slice(1).join('.'), // Remove the top-level 'body'/'query'/'params' prefix
        message: err.message,
      }));
      next(new ApiError(400, 'Validation failed', formattedErrors));
    }
  };
};

export default validate;

