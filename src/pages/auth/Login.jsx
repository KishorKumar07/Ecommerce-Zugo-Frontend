import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMail, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔴 Form submitted, preventing default behavior');
    console.log('🔴 Event type:', e.type);
    console.log('🔴 Form Data:', formData);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log('🟡 Attempting login...');
      const response = await login(formData);
      console.log('🟢 Login successful! Response:', response);
      console.log('🟢 User data:', response?.user);
      console.log('🟢 Token:', response?.token);
      console.log('🟢 localStorage token:', localStorage.getItem('token'));
      console.log('🟢 localStorage user:', localStorage.getItem('user'));
      
      toast.success('Welcome back!');
      // Temporarily commented out for debugging - DO NOT NAVIGATE
      navigate('/');
      
      console.log('🟢 Login process completed. Page should NOT refresh or navigate.');
      console.log('🟢 If page refreshed, check for redirects in authStore or authService');
    } catch (error) {
      console.error('🔴 Login error:', error);
      console.error('🔴 Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Login failed');
    }
    
    return false; // Extra prevention
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(56,189,248,0.08),transparent,rgba(129,140,248,0.1))] pointer-events-none" />
      <div className="relative max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center z-10">
        {/* Left Side - Illustration/Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <div className="text-center space-y-6">
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-64 h-64 mx-auto bg-gradient-to-br from-sky-500/60 via-indigo-500/60 to-fuchsia-500/60 rounded-full flex items-center justify-center shadow-[0_45px_120px_-60px_rgba(56,189,248,0.9)]"
            >
              <span className="text-white text-8xl font-bold">Z</span>
            </motion.div>
            <h1 className="text-4xl font-semibold text-white">
              Welcome to <span className="text-gradient">Zugo Private Limited</span>
            </h1>
            <p className="text-xl text-slate-300">
              Your premium shopping destination
            </p>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="card p-10 md:p-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white mb-2">Login</h2>
            <p className="text-slate-400">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={IoMail}
              error={errors.email}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={IoLockClosed}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
              </button>
            </div>

            

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Sign In
            </Button>

            <div className="text-center">
              <p className="text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-sky-300 hover:text-sky-100 font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>

     
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

