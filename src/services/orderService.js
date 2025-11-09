import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const orderService = {
  async checkout(checkoutData) {
    const response = await api.post(API_ENDPOINTS.CHECKOUT, checkoutData);
    return response.data;
  },

  async getOrders() {
    const response = await api.get(API_ENDPOINTS.ORDERS);
    return response.data;
  },

  async getAllOrders() {
    const response = await api.get(API_ENDPOINTS.ORDERS_ALL);
    return response.data;
  }
};

