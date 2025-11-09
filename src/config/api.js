export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id) => `/api/products/${id}`,
  
  // Cart
  CART: '/api/cart',
  CART_ADD: '/api/cart/add',
  CART_REMOVE: '/api/cart/remove',
  
  // Orders
  CHECKOUT: '/api/orders/checkout',
  ORDERS: '/api/orders',
  ORDERS_ALL: '/api/orders/all'
};

