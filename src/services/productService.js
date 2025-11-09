import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const productService = {
  async getAllProducts() {
    const response = await api.get(API_ENDPOINTS.PRODUCTS);
    return response.data;
  },

  async getProductById(id) {
    const response = await api.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  },

  async createProduct(productData) {
    const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(API_ENDPOINTS.PRODUCT_BY_ID(id), productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  }
};

