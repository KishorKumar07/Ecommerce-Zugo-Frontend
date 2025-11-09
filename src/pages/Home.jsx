import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoCart,
  IoSearch,
  IoStar,
  IoTrendingUp,
  IoFlash,
  IoRocketSharp,
  IoShieldCheckmark,
  IoSparkles,
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Galaxy from '../components/visuals/Galaxy';

const heroStats = [
  { label: 'Premium Brands', value: '120+', icon: IoShieldCheckmark },
  { label: 'Express Deliveries', value: '48h', icon: IoFlash },
  { label: 'Customer Delight', value: '4.9', icon: IoStar },
];

const features = [
  {
    icon: IoSparkles,
    title: 'Curated Collections',
    desc: 'Handpicked drops from the most loved brands every week.',
  },
  {
    icon: IoTrendingUp,
    title: 'Adaptive Pricing',
    desc: 'Dynamic offers that respond to what you love in real-time.',
  },
  {
    icon: IoRocketSharp,
    title: 'Same Day Dispatch',
    desc: 'Orders placed before 3pm fly out the same day, no extra cost.',
  },
];

const highlightBadges = [
  'Free shipping over ₹599',
  'Ultra-secure checkout',
  'Carbon-neutral packaging',
];

const Home = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId) => {
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
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    if (!searchTerm.trim()) return products;

    const query = searchTerm.toLowerCase();
    return products.filter((product) => {
      const name = product.name?.toLowerCase() ?? '';
      const description = product.description?.toLowerCase() ?? '';
      return name.includes(query) || description.includes(query);
    });
  }, [products, searchTerm]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <Galaxy
          className="w-full h-full"
          hueShift={220}
          glowIntensity={0.45}
          density={1.2}
          twinkleIntensity={0.45}
          rotationSpeed={0.12}
          speed={1.2}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/70 to-slate-900/60 backdrop-blur-sm pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none" />
      </div>

      <main className="relative">
        {/* Hero */}
        <section className="pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium"
                >
                  <IoSparkles className="w-4 h-4 text-primary-200" />
                  <span>Welcome to the Zugo Ultimate Experience</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.06 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
                >
                  Elevate your everyday essentials with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-sky-300 to-emerald-300">
                    future-grade
                  </span>{' '}
                  commerce.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.12 }}
                  className="text-lg text-slate-200/90 max-w-xl leading-relaxed"
                >
                  Immerse yourself in a kinetic storefront designed for explorers. Discover exclusive
                  product drops, adaptive pricing and ultra-fast delivery powered by human-first commerce
                  intelligence.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.18 }}
                  className="flex flex-wrap gap-3"
                >
                  {highlightBadges.map((text) => (
                    <span
                      key={text}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-200"
                    >
                      {text}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.24 }}
                  className="flex flex-col sm:flex-row gap-4 sm:items-center"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="shadow-[0_20px_60px_-20px_rgba(56,189,248,0.6)]"
                  >
                    Browse Collections
                  </Button>
                  <div className="flex items-center gap-3 text-sm text-slate-200/80">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="w-8 h-8 rounded-full border border-slate-900 bg-white/80 bg-center bg-cover"
                          style={{ backgroundImage: `url(https://i.pravatar.cc/150?img=${20 + i})` }}
                        />
                      ))}
                    </div>
                    <span>Join 50K+ delighted shoppers this month</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.18 }}
                className="relative"
              >
                <div className="absolute -inset-8 bg-gradient-to-br from-violet-500/30 via-sky-500/20 to-emerald-400/30 blur-3xl rounded-full pointer-events-none" />
                <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-widest text-slate-200/70">Trending Drop</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-50">Neo Minimalist Desk Kit</p>
                      </div>
                      <span className="px-4 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-300/40">
                        Live now
                      </span>
                    </div>

                    <div className="relative h-56 rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-900/20 to-slate-800/40 border border-white/10 overflow-hidden">
                      <img
                        src="https://img.freepik.com/premium-photo/computer-monitor-desk-front-wall-with-plant-minimalist-workspace-concept-with-modern-technology-greenery_163305-319111.jpg"
                        alt="Trending setup"
                        className="w-full h-full object-cover mix-blend-luminosity opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200/80">
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">Limited</span>
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">Ships in 12h</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-200/90">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-widest text-slate-300/70">Starting at</p>
                        <p className="text-2xl font-semibold text-slate-50">₹7,999</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white/10 hover:bg-white/20 border border-white/20"
                      >
                        Explore Drop
                      </Button>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.36 }}
                  className="mt-6 grid sm:grid-cols-3 gap-4"
                >
                  {heroStats.map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-lg"
                    >
                      <div className="flex items-center gap-3 text-slate-200/80 text-sm">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span>{label}</span>
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-slate-50">{value}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature tiles */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, amount: 0.3 }}
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {features.map(({ icon: Icon, title, desc }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-200 border border-white/20">
                      <Icon className="w-6 h-6" />
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">{title}</h3>
                      <p className="text-sm text-slate-200/80 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Search */}
        <section className="pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 sm:p-3 shadow-2xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200/60 w-5 h-5" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search the universe of products..."
                    className="w-full rounded-2xl border border-transparent bg-white/10 pl-12 pr-4 py-4 text-base text-white placeholder:text-slate-300/60 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400/50 transition"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-sky-400/20 hover:bg-sky-400/30 border border-sky-300/30 text-white whitespace-nowrap"
                >
                  Advanced Filters
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-300/70 mb-4">Featured</p>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white flex items-center gap-3">
                  Orbiting Products
                  <span className="inline-flex h-10 items-center rounded-full border border-sky-400/40 bg-sky-400/10 px-4 text-sm text-sky-200">
                    Updated hourly
                  </span>
                </h2>
                <p className="mt-3 text-base text-slate-200/80 max-w-2xl">
                  Discover the most loved picks from our community—curated to fit into your daily rituals with
                  unparalleled style and performance.
                </p>
              </div>
              <Button
                variant="secondary"
                size="md"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="self-start md:self-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              >
                Back to top
              </Button>
            </motion.div>

            {loading ? (
              <div className="py-24 flex justify-center">
                <Loader />
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-24 text-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                <p className="text-xl font-semibold text-slate-200">No products match your search yet.</p>
                <p className="mt-3 text-slate-300/80">
                  Try a different keyword or explore the curated collections above.
                </p>
              </motion.div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={index}
                    onAddToCart={handleAddToCart}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const ProductCard = ({ product, index, onAddToCart, isAdmin }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-sky-400/30 via-fuchsia-400/20 to-emerald-400/30 opacity-0 group-hover:opacity-100 transition duration-500 blur" />
      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
        <div
          className="relative h-64 overflow-hidden cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
            src={product.image || 'https://via.placeholder.com/600x400?text=Product'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-semibold bg-white/15 border border-white/20 text-white">
              In spotlight
            </span>
            <span className="rounded-full px-3 py-1 text-xs font-semibold bg-amber-400/20 border border-amber-200/40 text-amber-100 flex items-center gap-1">
              <IoStar className="w-3.5 h-3.5" />
              4.5
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 space-y-4">
          <div className="space-y-2">
            <h3
              className="text-xl font-semibold text-white cursor-pointer hover:text-sky-200 transition-colors line-clamp-2"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {product.name}
            </h3>
            <p className="text-sm text-slate-200/70 line-clamp-3">{product.description}</p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-slate-300/70">Price</p>
              <p className="text-2xl font-semibold text-sky-100">
                ₹{Number(product.price || 0).toFixed(2)}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddToCart(product._id)}
              disabled={isAdmin}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isAdmin
                  ? 'bg-white/10 text-slate-300/50 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 text-slate-950 shadow-lg shadow-sky-500/30'
              }`}
            >
              <IoCart className="w-4 h-4" />
              {isAdmin ? 'Admin mode' : 'Add to cart'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;

