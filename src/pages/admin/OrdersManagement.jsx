import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IoReceipt,
  IoCalendar,
  IoCard,
  IoCube,
  IoPeople,
  IoMail,
  IoPricetag
} from 'react-icons/io5';
import Loader from '../../components/common/Loader';
import { useOrderStore } from '../../store/orderStore';

const OrdersManagement = () => {
  const { orders, loading, fetchAllOrders, error } = useOrderStore();

  console.log("ORders  Page : ", orders);
  

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen gradient-bg py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.08),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.06),transparent,rgba(129,140,248,0.08))] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-semibold text-white mb-2">
            Manage <span className="text-gradient">Orders</span>
          </h1>
          <p className="text-slate-400">
            View all orders placed across the store
          </p>
          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl border border-rose-400/40 bg-rose-500/10 text-rose-200">
              {error}
            </div>
          )}
        </motion.div>

        {(!orders || orders.length === 0) ? (
          <div className="card p-12 text-center">
            <IoReceipt className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">No Orders Found</h2>
            <p className="text-slate-400">
              Orders will appear here once customers start placing them.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <AdminOrderCard key={order._id || index} order={order} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminOrderCard = ({ order, index }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getPaymentModeLabel = (mode) => mode ? mode.toUpperCase() : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card overflow-hidden"
    >
      <div className="bg-gradient-to-r from-sky-500/90 via-indigo-500/90 to-fuchsia-500/90 text-white p-6">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 opacity-90 mb-1">
              <IoReceipt className="w-5 h-5" />
              <span className="text-sm font-medium">Order ID</span>
            </div>
            <p className="font-semibold text-lg">
              #{order._id?.slice(-8)?.toUpperCase() || 'UNKNOWN'}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 opacity-90 mb-1">
              <IoCalendar className="w-5 h-5" />
              <span className="text-sm font-medium">Placed On</span>
            </div>
            <p className="font-semibold">{formatDate(order.createdAt)}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 opacity-90 mb-1">
              <IoCard className="w-5 h-5" />
              <span className="text-sm font-medium">Payment Mode</span>
            </div>
            <p className="font-semibold">{getPaymentModeLabel(order.paymentMode)}</p>
          </div>

          <div className="text-right">
            <div className="text-sm opacity-90 mb-1">Total Amount</div>
            <div className="text-3xl font-bold">
              ₹{Number(order.totalPrice || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 bg-white/5 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <IoPeople className="w-5 h-5 text-sky-200" />
            <span className="font-semibold text-slate-100">{order.user?.name || 'Unknown User'}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <IoMail className="w-5 h-5 text-fuchsia-200" />
            <span className="text-slate-300">{order.user?.email || 'No email'}</span>
          </div>
          
          <div className="ml-auto text-sm text-slate-400">
            Items: <span className="font-semibold text-slate-100">{order.items?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {order.items?.map((item, idx) => (
            <div
              key={`${order._id}-${idx}`}
              className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={item.product?.image || 'https://via.placeholder.com/100'}
                  alt={item.product?.name || 'Product'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">
                  {item.product?.name || 'Unnamed Product'}
                </h4>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {item.product?.description || 'No description available'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <span>
                    Quantity: <span className="font-semibold text-slate-100">{item.quantity}</span>
                  </span>
                  <span>
                    Price: <span className="font-semibold text-sky-200">
                      ₹{Number(item?.priceAtPurchase || 0).toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
            
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OrdersManagement;

