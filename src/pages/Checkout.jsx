import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoCard,
  IoWallet,
  IoCash,
  IoCheckmarkCircle,
  IoLocation,
  IoPerson,
  IoMail,
  IoCall
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, fetchCart, clearCart } = useCartStore();
  const { checkout, loading } = useOrderStore();
  const { user } = useAuthStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMode: 'COD'
  });
  const [errors, setErrors] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City name is too short';
    }

    // ZIP code validation
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5,6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 5-6 digits';
    }

    // Payment method specific validations
    if (formData.paymentMode === 'Card') {
      if (!paymentDetails.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }

      if (!paymentDetails.cardHolder) {
        newErrors.cardHolder = 'Card holder name is required';
      } else if (paymentDetails.cardHolder.trim().length < 3) {
        newErrors.cardHolder = 'Card holder name is too short';
      }

      if (!paymentDetails.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiryDate)) {
        newErrors.expiryDate = 'Invalid format (use MM/YY)';
      }

      if (!paymentDetails.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3}$/.test(paymentDetails.cvv)) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
    } else if (formData.paymentMode === 'UPI') {
      if (!paymentDetails.upiId) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId)) {
        newErrors.upiId = 'Invalid UPI ID format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await checkout({ paymentMode: formData.paymentMode });
      setShowSuccess(true);
      clearCart();
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_60%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative card max-w-md text-center space-y-6 p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <IoCheckmarkCircle className="w-24 h-24 text-emerald-300 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-semibold text-white">
            Order placed successfully!
          </h2>
          <p className="text-slate-400">
            Thank you for your purchase. Your order is now orbiting our dispatch network.
          </p>
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/orders')}
            >
              View Orders
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.1),_transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(56,189,248,0.08),transparent,rgba(129,140,248,0.08))] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-semibold text-white mb-3">
            <span className="text-gradient">Checkout</span>
          </h1>
          <p className="text-slate-400">Complete your purchase and prepare for launch.</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Personal Orbit
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    icon={IoPerson}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={IoMail}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={IoCall}
                    placeholder="+1 (555) 000-0000"
                    error={errors.phone}
                    required
                  />
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Shipping Coordinates
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Street Address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    icon={IoLocation}
                    placeholder="123 Main St, Apt 4B"
                    error={errors.address}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="12345"
                      error={errors.zipCode}
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Payment Method
                </h2>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {[
                    { value: 'COD', icon: IoCash, label: 'Cash on Delivery' },
                    { value: 'UPI', icon: IoWallet, label: 'UPI Payment' },
                    { value: 'Card', icon: IoCard, label: 'Credit/Debit Card' }
                  ].map((method) => (
                    <motion.button
                      key={method.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFormData({ ...formData, paymentMode: method.value })
                      }
                      className={`p-6 rounded-2xl border transition-all backdrop-blur ${
                        formData.paymentMode === method.value
                          ? 'border-sky-400/70 bg-sky-400/15 shadow-[0_25px_60px_-40px_rgba(56,189,248,0.9)]'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/12'
                      }`}
                    >
                      <method.icon
                        className={`w-8 h-8 mx-auto mb-3 ${
                          formData.paymentMode === method.value
                            ? 'text-sky-200'
                            : 'text-slate-400'
                        }`}
                      />
                      <div
                        className={`font-medium ${
                          formData.paymentMode === method.value
                            ? 'text-white'
                            : 'text-slate-300'
                        }`}
                      >
                        {method.label}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Payment Method Details */}
                <motion.div
                  key={formData.paymentMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
                >
                  {/* Cash on Delivery UI */}
                  {formData.paymentMode === 'COD' && (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-emerald-400/15 border border-emerald-300/40 rounded-full flex items-center justify-center mx-auto">
                        <IoCash className="w-8 h-8 text-emerald-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        Cash on Delivery
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Pay with cash when your order is delivered to your doorstep.
                      </p>
                      <div className="bg-sky-400/10 border border-sky-300/30 rounded-lg p-4 text-sm text-sky-100">
                        <p className="font-semibold mb-1 text-white">Please Note:</p>
                        <p className="text-slate-200">• Keep exact change ready</p>
                      </div>
                    </div>
                  )}

                  {/* UPI Payment UI */}
                  {formData.paymentMode === 'UPI' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-violet-500/20 border border-violet-400/40 rounded-full flex items-center justify-center mx-auto mb-3">
                          <IoWallet className="w-8 h-8 text-violet-200" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          UPI Payment
                        </h3>
                      </div>

                      {/* Mock QR Code */}
                      <div className="p-6 rounded-2xl border border-dashed border-white/20 bg-white/5">
                        <div className="w-48 h-48 mx-auto bg-gradient-to-br from-violet-500/20 to-sky-500/20 rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <div className="grid grid-cols-8 gap-1 mb-2">
                              {[...Array(64)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 ${
                                    Math.random() > 0.5 ? 'bg-slate-200' : 'bg-transparent border border-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Scan QR Code</p>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-3 rounded-full bg-white/5 text-slate-400 backdrop-blur">
                            OR
                          </span>
                        </div>
                      </div>

                      {/* UPI ID Input */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Enter UPI ID
                        </label>
                        <input
                          type="text"
                          name="upiId"
                          value={paymentDetails.upiId}
                          onChange={handlePaymentDetailsChange}
                          placeholder="yourname@upi"
                          className={`input-field ${
                            errors.upiId
                              ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30'
                              : 'focus:border-violet-400 focus:ring-violet-400/30'
                          }`}
                        />
                        {errors.upiId && (
                          <p className="mt-1 text-sm text-rose-300">{errors.upiId}</p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="flex-1 py-2 px-4 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-200 hover:bg-white/15 transition"
                        >
                          Google Pay
                        </button>
                        <button
                          type="button"
                          className="flex-1 py-2 px-4 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-200 hover:bg-white/15 transition"
                        >
                          PhonePe
                        </button>
                        <button
                          type="button"
                          className="flex-1 py-2 px-4 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-200 hover:bg-white/15 transition"
                        >
                          Paytm
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Credit/Debit Card UI */}
                  {formData.paymentMode === 'Card' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-sky-500/20 border border-sky-400/40 rounded-full flex items-center justify-center mx-auto mb-3">
                          <IoCard className="w-8 h-8 text-sky-200" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Card Payment
                        </h3>
                      </div>

                      {/* Mock Card Preview */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-12 h-8 bg-yellow-400 rounded"></div>
                          <div className="text-right">
                            <p className="text-xs opacity-75">Valid Thru</p>
                            <p className="font-mono">MM/YY</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="font-mono text-xl tracking-wider">
                            •••• •••• •••• ••••
                          </p>
                          <p className="text-sm opacity-90">CARD HOLDER NAME</p>
                        </div>
                        <div className="absolute bottom-6 right-6">
                          <div className="flex gap-1">
                            <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full"></div>
                            <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full -ml-3"></div>
                          </div>
                        </div>
                      </div>

                      {/* Card Details Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-200 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentDetails.cardNumber}
                            onChange={handlePaymentDetailsChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            className={`input-field font-mono ${
                              errors.cardNumber
                                ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30'
                                : 'focus:border-sky-400 focus:ring-sky-400/30'
                            }`}
                          />
                          {errors.cardNumber && (
                            <p className="mt-1 text-sm text-rose-300">{errors.cardNumber}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-200 mb-2">
                            Card Holder Name
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={paymentDetails.cardHolder}
                            onChange={handlePaymentDetailsChange}
                            placeholder="JOHN DOE"
                            className={`input-field uppercase ${
                              errors.cardHolder
                                ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30'
                                : 'focus:border-sky-400 focus:ring-sky-400/30'
                            }`}
                          />
                          {errors.cardHolder && (
                            <p className="mt-1 text-sm text-rose-300">{errors.cardHolder}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={paymentDetails.expiryDate}
                              onChange={handlePaymentDetailsChange}
                              placeholder="MM/YY"
                              maxLength="5"
                              className={`input-field font-mono ${
                                errors.expiryDate
                                  ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30'
                                  : 'focus:border-sky-400 focus:ring-sky-400/30'
                              }`}
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-rose-300">{errors.expiryDate}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">
                              CVV
                            </label>
                            <input
                              type="password"
                              name="cvv"
                              value={paymentDetails.cvv}
                              onChange={handlePaymentDetailsChange}
                              placeholder="123"
                              maxLength="3"
                              className={`input-field font-mono ${
                                errors.cvv
                                  ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30'
                                  : 'focus:border-sky-400 focus:ring-sky-400/30'
                              }`}
                            />
                            {errors.cvv && (
                              <p className="mt-1 text-sm text-rose-300">{errors.cvv}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-300 bg-emerald-400/10 border border-emerald-400/30 p-3 rounded-lg">
                          <IoCheckmarkCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                          <span>Your card details are encrypted and secure</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 sticky top-24"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                  {cartItems?.map((item) => (
                    <div
                      key={item.product?._id}
                      className="flex gap-3 pb-3 border-b border-white/10"
                    >
                      <img
                        src={item.product?.image || 'https://via.placeholder.com/80'}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg border border-white/10"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-slate-100 line-clamp-1">
                          {item.product?.name}
                        </h4>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-sky-200">
                          ₹{(item.product?.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-6">
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-slate-200">Total Amount</span>
                      <span className="text-3xl font-semibold text-gradient">
                        ₹{totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                >
                  Place Order
                </Button>

                <p className="text-xs text-slate-400 text-center mt-4">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

