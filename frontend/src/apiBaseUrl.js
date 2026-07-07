// Central API base URL for all frontend requests
// Change this value for different environments (dev, prod, etc)

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL !== undefined
  ? process.env.REACT_APP_API_BASE_URL
  : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export default API_BASE_URL;
