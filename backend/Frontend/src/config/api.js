// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export const API_ENDPOINTS = {
  // User endpoints
  SIGNUP: `${API_BASE_URL}/user/signup`,
  LOGIN: `${API_BASE_URL}/user/login`,
  ADMIN_LOGIN: `${API_BASE_URL}/user/login/admin`,
  USER_PROFILE: `${API_BASE_URL}/user/user/profile`,
  RETURN_BOOK: `${API_BASE_URL}/user/book/return`,
  
  // Book endpoints
  BOOKS: `${API_BASE_URL}/book`,
  BOOKS_BY_CATEGORY: `${API_BASE_URL}/book/category`,
  BORROW_BOOK: `${API_BASE_URL}/user/borrow`,
  
  // Category endpoints
  CATEGORIES: `${API_BASE_URL}/category`,
};

export default API_BASE_URL;
