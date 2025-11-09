import { create } from 'zustand';
import { productService } from '../services/productService';

export const useProductStore = create((set) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await productService.getAllProducts();
      // Handle different response structures
      const productsArray = Array.isArray(data) ? data : (data.products || data.data || []);
      set({ products: productsArray, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch products',
        loading: false,
        products: [] // Ensure products is always an array
      });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null, currentProduct: null });
    try {
      const data = await productService.getProductById(id);
      const product =
        data?.product ||
        data?.data ||
        data?.result ||
        data;

      set({ currentProduct: product, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch product',
        loading: false,
        currentProduct: null
      });
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const data = await productService.createProduct(productData);
      set((state) => ({
        products: [...state.products, data],
        loading: false
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create product',
        loading: false
      });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const data = await productService.updateProduct(id, productData);
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? data : p
        ),
        loading: false
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update product',
        loading: false
      });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete product',
        loading: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

