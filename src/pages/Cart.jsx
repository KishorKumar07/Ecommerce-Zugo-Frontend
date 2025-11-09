import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoTrash,
  IoAdd,
  IoRemove,
  IoCart,
  IoArrowForward,
  IoStorefront
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, loading, fetchCart, addToCart, removeFromCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      await addToCart(productId, change);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_55%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center space-y-6"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-6"
          >
            <IoCart className="w-32 h-32 mx-auto text-slate-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">Your cart is floating in zero-gravity</h2>
          <p className="text-slate-400">
            Looks like you haven't added anything to your cart yet
          </p>
          <div className="flex justify-center pt-4">
            <Link to="/">
              <Button variant="primary" size="lg" icon={IoStorefront}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.08),_transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.05),transparent,rgba(129,140,248,0.08))] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-3">
            Shopping <span className="text-gradient">Cart</span>
          </h1>
          <p className="text-slate-400">
            You have <span className="text-sky-200 font-semibold">{cartItems.length}</span> item(s) in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product?._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-6 hover:shadow-[0_35px_80px_-50px_rgba(56,189,248,0.75)] transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 bg-white/5">
                      <img
                        src={item.product?.image || 'https://via.placeholder.com/200'}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-white">
                            {item.product?.name}
                          </h3>
                          <p className="text-slate-400 text-sm line-clamp-2">
                            {item.product?.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product?._id)}
                          className="p-2 text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <IoTrash className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.product?._id, item.quantity, -1)
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white transition-colors"
                          >
                            <IoRemove />
                          </button>
                          <span className="w-12 text-center font-semibold text-lg text-slate-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.product?._id, item.quantity, 1)
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white transition-colors"
                          >
                            <IoAdd />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-2xl font-semibold text-gradient">
                            ₹{(item.product?.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-slate-400">
                            ₹{item.product?.price?.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6 sticky top-24"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-slate-200">Total Amount</span>
                    <span className="text-3xl font-semibold text-gradient">
                      ₹{totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="input-field flex-1"
                  />
                  <Button variant="outline" className="shrink-0 px-5 py-3">
                    Apply
                  </Button>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={IoArrowForward}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>

              <Link to="/">
                <button className="w-full mt-4 text-sky-200 hover:text-white font-semibold text-center transition">
                  Continue Shopping
                </button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Secure Checkout
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  Free Returns within 30 days
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                  24/7 Customer Support
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

