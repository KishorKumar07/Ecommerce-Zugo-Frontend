import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IoCube,
  IoCart,
  IoPeople,
  IoTrendingUp,
  IoAdd
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/productStore';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const stats = [
    {
      title: 'Total Products',
      value: Array.isArray(products) ? products.length : 0,
      icon: IoCube,
      color: 'from-sky-500 via-sky-400 to-cyan-400',
      bgColor: 'bg-sky-400/15 border border-sky-300/30 text-sky-200'
    },
    {
      title: 'Total Orders',
      value: '156',
      icon: IoCart,
      color: 'from-emerald-500 via-emerald-400 to-teal-400',
      bgColor: 'bg-emerald-400/15 border border-emerald-300/30 text-emerald-200'
    },
    {
      title: 'Total Users',
      value: '1,234',
      icon: IoPeople,
      color: 'from-violet-500 via-fuchsia-500 to-purple-400',
      bgColor: 'bg-violet-400/15 border border-violet-300/30 text-violet-200'
    },
    {
      title: 'Total Revenue',
      value: '₹45,231',
      icon: IoTrendingUp,
      color: 'from-amber-500 via-orange-500 to-rose-400',
      bgColor: 'bg-amber-400/15 border border-amber-300/30 text-amber-200'
    }
  ];

  return (
    <div className="min-h-screen gradient-bg py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.1),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.07),transparent,rgba(129,140,248,0.08))] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-semibold text-white mb-2">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-slate-400">Manage your e-commerce store</p>
          </div>
          <Button
            variant="primary"
            icon={IoAdd}
            onClick={() => navigate('/admin/products/new')}
          >
            Add Product
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-[0_35px_90px_-60px_rgba(56,189,248,0.85)] transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl backdrop-blur ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{WebkitTextFillColor: 'transparent'}} />
                </div>
              </div>
              <h3 className="text-slate-400 text-sm font-medium mb-2">{stat.title}</h3>
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="p-6 border border-white/10 rounded-2xl hover:border-sky-400/60 hover:bg-sky-400/10 transition-all text-left group"
            >
              <IoCube className="w-8 h-8 text-slate-400 group-hover:text-sky-200 mb-3 transition" />
              <h3 className="font-semibold text-lg text-white mb-2">Manage Products</h3>
              <p className="text-slate-400 text-sm">Add, edit, or remove products from your store</p>
            </button>

            <button
              onClick={() => navigate('/admin/orders')}
              className="p-6 border border-white/10 rounded-2xl hover:border-emerald-400/60 hover:bg-emerald-400/10 transition-all text-left group"
            >
              <IoCart className="w-8 h-8 text-slate-400 group-hover:text-emerald-200 mb-3 transition" />
              <h3 className="font-semibold text-lg text-white mb-2">View Orders</h3>
              <p className="text-slate-400 text-sm">Track and manage customer orders</p>
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="p-6 border border-white/10 rounded-2xl hover:border-violet-400/60 hover:bg-violet-400/10 transition-all text-left group"
            >
              <IoPeople className="w-8 h-8 text-slate-400 group-hover:text-violet-200 mb-3 transition" />
              <h3 className="font-semibold text-lg text-white mb-2">Manage Users</h3>
              <p className="text-slate-400 text-sm">View and manage user accounts</p>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New order placed', time: '5 minutes ago', type: 'success' },
              { action: 'Product "Premium Headphones" updated', time: '1 hour ago', type: 'info' },
              { action: 'New user registered', time: '2 hours ago', type: 'success' },
              { action: 'Low stock alert for "Smart Watch"', time: '3 hours ago', type: 'warning' }
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-white">{activity.action}</p>
                    <p className="text-sm text-slate-400">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

