export const parseError = (error) => {
  if (!error) {
    return 'An unexpected error occurred.';
  }

  // Network or Connection Error
  if (error.message === 'Network Error') {
    return 'Server is unreachable. Please check your network connection or ensure the backend server is running.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'Connection timed out. Please try again.';
  }

  const response = error.response;
  if (!response) {
    return error.message || 'An unexpected error occurred.';
  }

  const status = response.status;
  const data = response.data;

  // Validation Errors (e.g., Zod validator arrays or schema lists)
  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors.map((err) => err.message).join(', ') || 'Validation failed.';
  }

  if (data?.message) {
    return data.message;
  }

  switch (status) {
    case 400:
      return 'Bad request. Please check your submission data.';
    case 401:
      return 'Unauthorized. Please check your credentials or log in again.';
    case 403:
      return 'Forbidden. You do not have the required permissions to perform this action.';
    case 404:
      return 'Requested resource could not be found.';
    case 429:
      return 'Too many requests. Please wait a few minutes before trying again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error. The service is temporarily unavailable. Please try again later.';
    default:
      return `Server encountered an error (${status}). Please try again.`;
  }
};
