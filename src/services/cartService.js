import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const cartService = {
  async getCart() {
    const response = await api.get(API_ENDPOINTS.CART);
    return response.data.data;
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post(API_ENDPOINTS.CART_ADD, {
      productId,
      quantity
    });
    return response.data;
  },

  async removeFromCart(productId) {
    const response = await api.post(API_ENDPOINTS.CART_REMOVE, {
      productId
    });
    return response.data;
  }
};

