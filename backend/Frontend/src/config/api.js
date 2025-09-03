// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL ;
const API_RENDER_URL = 'https://librazen-7.onrender.com';
export const API_ENDPOINTS = {
  // User endpoints
  SIGNUP: `${API_RENDER_URL}/user/signup`,
  LOGIN: `${API_RENDER_URL}/user/login`,
  ADMIN_LOGIN: `${API_RENDER_URL}/user/login/admin`,
  USER_PROFILE: `${API_RENDER_URL}/user/user/profile`,
  ADMIN_PROFILE: `${API_RENDER_URL}/user/admin/profile`,
  ADMIN_PROFILE_UPDATE: `${API_RENDER_URL}/user/admin/profile/update`,
  RETURN_BOOK: `${API_RENDER_URL}/user/book/return`,
  
  // Book endpoints
  BOOKS: `${API_RENDER_URL}/book`,
  BOOKS_BY_CATEGORY: `${API_RENDER_URL}/book/category`,
  BORROW_BOOK: `${API_RENDER_URL}/user/borrow`,
  
  // Category endpoints
  CATEGORIES: `${API_RENDER_URL}/category`,
  
  // Admin endpoints
  ADMIN_USERS_BORROWED: `${API_RENDER_URL}/user/admin/users/borrowed`,
  ADMIN_USERS_OVERDUE: `${API_RENDER_URL}/user/admin/users/overdue`,
  ADMIN_STATISTICS: `${API_RENDER_URL}/user/admin/statistics`,
};

export default API_RENDER_URL;
