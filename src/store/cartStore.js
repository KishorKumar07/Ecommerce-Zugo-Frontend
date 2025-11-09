import { create } from 'zustand';
import { cartService } from '../services/cartService';

export const useCartStore = create((set) => ({
  cart: null,
  cartItems: [],
  totalPrice: 0,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      console.log('🛒 CartStore: Fetching cart...');
      console.log('🛒 Token in localStorage:', localStorage.getItem('token'));
      const data = await cartService.getCart();
      console.log('🛒 CartStore: Cart fetched successfully:', data);
      
      // Calculate total price from items
      const totalPrice = data.items?.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * (item.quantity || 0);
      }, 0) || 0;
      
      set({
        cart: data,
        cartItems: data.items || [],
        totalPrice: totalPrice,
        loading: false
      });
    } catch (error) {
      console.error('🔴 CartStore: Failed to fetch cart:', error);
      console.error('🔴 Error status:', error.response?.status);
      console.error('🔴 Error message:', error.response?.data?.message);
      set({
        error: error.response?.data?.message || 'Failed to fetch cart',
        loading: false
      });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const data = await cartService.addToCart(productId, quantity);
      
      // Calculate total price from items
      const totalPrice = data.items?.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * (item.quantity || 0);
      }, 0) || 0;
      
      set({
        cart: data,
        cartItems: data.items || [],
        totalPrice: totalPrice,
        loading: false
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add to cart',
        loading: false
      });
      throw error;
    }
  },

  removeFromCart: async (productId) => {
    set({ loading: true, error: null });
    try {
      const data = await cartService.removeFromCart(productId);
      
      // Calculate total price from items
      const totalPrice = data.items?.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * (item.quantity || 0);
      }, 0) || 0;
      
      set({
        cart: data,
        cartItems: data.items || [],
        totalPrice: totalPrice,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to remove from cart',
        loading: false
      });
    }
  },

  clearCart: () => {
    set({
      cart: null,
      cartItems: [],
      totalPrice: 0
    });
  },

  clearError: () => set({ error: null })
}));

