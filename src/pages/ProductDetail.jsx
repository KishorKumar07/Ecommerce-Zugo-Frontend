import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoCart,
  IoStar,
  IoHeart,
  IoHeartOutline,
  IoArrowBack,
  IoCheckmarkCircle,
  IoShield
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loading, fetchProductById } = useProductStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchProductById(id);
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (isAdmin) {
      toast.error('Admins can only manage products.');
      return;
    }

    try {
      await addToCart(currentProduct._id, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (isAdmin) {
      toast.error('Admins can only manage products.');
      return;
    }

    try {
      await addToCart(currentProduct._id, quantity);
      navigate('/checkout');
    } catch (error) {
      toast.error('Failed to proceed to checkout');
    }
  };

  if (loading || !currentProduct) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen gradient-bg py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.06),transparent,rgba(129,140,248,0.08))] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-sky-200 mb-8 font-medium transition"
        >
          <IoArrowBack className="w-5 h-5" />
          Back to Products
        </motion.button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-24">
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_45px_120px_-60px_rgba(56,189,248,0.95)] overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={currentProduct.image || 'https://via.placeholder.com/600'}
                  alt={currentProduct.name}
                  className="w-full h-[500px] object-cover"
                />
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-6 right-6 p-3 bg-white/10 border border-white/20 rounded-full shadow-[0_20px_60px_-40px_rgba(56,189,248,0.9)] hover:scale-110 transition-transform backdrop-blur"
                >
                  {isFavorite ? (
                    <IoHeart className="w-6 h-6 text-rose-300" />
                  ) : (
                    <IoHeartOutline className="w-6 h-6 text-slate-200" />
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { icon: IoCheckmarkCircle, text: 'Quality Verified' },
                  { icon: IoShield, text: 'Secure Payment' },
                  { icon: IoStar, text: 'Top Rated' }
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    <badge.icon className="w-6 h-6 text-sky-200" />
                    <span className="text-xs font-medium text-slate-300 text-center">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl font-semibold text-white mb-4">
                {currentProduct.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <IoStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? 'text-amber-300' : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-400">4.5 (128 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-semibold text-gradient">
                  ₹{currentProduct.price?.toFixed(2)}
                </span>
                <span className="text-2xl text-slate-600 line-through">
                  ₹{(currentProduct.price * 1.2)?.toFixed(2)}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-400/15 border border-emerald-300/30 text-emerald-200">
                  Save 20%
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Inclusive of all taxes • Free shipping on orders over ₹500
              </p>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
              <p className="text-slate-300 leading-relaxed">
                {currentProduct.description || 'No description available.'}
              </p>
            </div>

            {/* Features */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-3">
                {[
                  'Premium quality materials',
                  'Durable and long-lasting',
                  'Easy to use and maintain',
                  '1-year warranty included',
                  'Free returns within 30 days'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <IoCheckmarkCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Actions */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-slate-200">Quantity:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-white/15 bg-white/5 text-slate-100 hover:bg-white/15 hover:text-white font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold text-lg text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-white/15 bg-white/5 text-slate-100 hover:bg-white/15 hover:text-white font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  icon={IoCart}
                  disabled={isAdmin}
                >
                  {isAdmin ? 'Manage Only' : 'Add to Cart'}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="primary"
                  size="lg"
                  disabled={isAdmin}
                >
                  {isAdmin ? 'Restricted' : 'Buy Now'}
                </Button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h4 className="font-semibold text-white mb-3">Delivery Information</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• Standard delivery: 3-5 business days</p>
                <p>• Express delivery: 1-2 business days</p>
                <p>• Free shipping on orders over ₹500</p>
                <p>• Cash on delivery available</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

