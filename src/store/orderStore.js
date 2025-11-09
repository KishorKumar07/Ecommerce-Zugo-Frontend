import { create } from 'zustand';
import { orderService } from '../services/orderService';

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null, orders: [] });
    try {
      const data = await orderService.getOrders();
      console.log("Orders: ", data);

      const ordersArray = Array.isArray(data)
        ? data
        : data?.data || data?.orders || [];

      set({ orders: ordersArray, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch orders',
        loading: false,
        orders: []
      });
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true, error: null, orders: [] });
    try {
      const data = await orderService.getAllOrders();

      const ordersArray = Array.isArray(data)
        ? data
        : data?.data || data?.orders || [];

      set({ orders: ordersArray, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch orders',
        loading: false,
        orders: []
      });
    }
  },

  checkout: async (checkoutData) => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.checkout(checkoutData);
      set((state) => ({
        orders: [data, ...state.orders],
        loading: false
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Checkout failed',
        loading: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

