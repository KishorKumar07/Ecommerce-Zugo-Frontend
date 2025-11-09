import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Public Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';

// Protected Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import ProductForm from './pages/admin/ProductForm';
import OrdersManagement from './pages/admin/OrdersManagement';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, token } = useAuthStore();
  const { fetchCart } = useCartStore();

  // Fetch cart when user is authenticated
  useEffect(() => {
    console.log('🔄 App.jsx useEffect triggered');
    console.log('🔄 isAuthenticated:', isAuthenticated);
    console.log('🔄 token from store:', token);
    console.log('🔄 token from localStorage:', localStorage.getItem('token'));
    
    if (isAuthenticated && token) {
      console.log('✅ User is authenticated, fetching cart...');
      // Small delay to ensure token is fully synced
      setTimeout(() => {
        console.log('🛒 Calling fetchCart after delay');
        fetchCart();
      }, 100);
    } else {
      console.log('⏸️ User not authenticated, skipping cart fetch');
    }
  }, [isAuthenticated, token, fetchCart]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute adminRestricted>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute adminRestricted>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute adminRestricted>
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly>
                  <OrdersManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <ProtectedRoute adminOnly>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedRoute adminOnly>
                  <ProductForm />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(2, 6, 23, 0.92)',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 30px 80px -40px rgba(14, 116, 144, 0.65)',
          },
          success: {
            iconTheme: {
              primary: '#34d399',
              secondary: '#020617',
            },
          },
          error: {
            iconTheme: {
              primary: '#f97066',
              secondary: '#020617',
            },
          },
        }}
      />
    </Router>
  );
}

// 404 Not Found Component
const NotFound = () => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_45%)] pointer-events-none" />
      <div className="text-center relative z-10 space-y-6">
        <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-violet-300 to-emerald-300">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-slate-100">Signal lost in the cosmos</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-slate-100 font-semibold shadow-[0_20px_60px_-35px_rgba(56,189,248,0.65)] transition hover:bg-white/10 hover:border-white/20"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default App;

