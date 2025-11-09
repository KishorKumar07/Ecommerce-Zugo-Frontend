import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IoReceipt,
  IoCalendar,
  IoCard,
  IoCheckmarkCircle,
  IoCube,
  IoTime
} from 'react-icons/io5';
import { jsPDF } from 'jspdf';
import { useOrderStore } from '../store/orderStore';
import Loader from '../components/common/Loader';

const Orders = () => {
  const { orders, loading, fetchOrders } = useOrderStore();


console.log("Orders: ", orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.1),_transparent_60%)] pointer-events-none" />
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
            <IoReceipt className="w-32 h-32 mx-auto text-slate-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">No orders in orbit yet</h2>
          <p className="text-slate-400">
            You haven&apos;t placed any orders yet. Launch your first purchase now!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.08),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.05),transparent,rgba(129,140,248,0.08))] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-semibold text-white mb-3">
            My <span className="text-gradient">Orders</span>
          </h1>
          <p className="text-slate-400">
            Track and manage every mission in your commerce journey.
          </p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <OrderCard key={order._id} order={order} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, index }) => {
  const formatCurrencyValue = (value) => {
    const numericValue = Number(value ?? 0);
    return numericValue.toFixed(2);
  };

  const computeOrderTotal = () => {
    if (order?.totalPrice != null && !Number.isNaN(Number(order.totalPrice))) {
      return Number(order.totalPrice);
    }

    return (
      order.items?.reduce((sum, item) => {
        const quantity = Number(item?.quantity ?? 0);
        const unitPrice = Number(
          item?.priceAtPurchase ?? item?.product?.price ?? 0
        );
        return sum + quantity * unitPrice;
      }, 0) ?? 0
    );
  };

  const orderTotal = computeOrderTotal();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentModeIcon = (mode) => {
    switch (mode?.toUpperCase()) {
      case 'COD':
        return { icon: IoCard, color: 'text-emerald-200', bg: 'bg-emerald-500/15' };
      case 'UPI':
        return { icon: IoCard, color: 'text-violet-200', bg: 'bg-violet-500/15' };
      case 'CARD':
        return { icon: IoCard, color: 'text-sky-200', bg: 'bg-sky-500/15' };
      default:
        return { icon: IoCard, color: 'text-slate-300', bg: 'bg-white/10' };
    }
  };

  const paymentInfo = getPaymentModeIcon(order.paymentMode);

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let cursorY = 20;

    const addText = (text, x = margin, options = {}) => {
      doc.text(text, x, cursorY, options);
      cursorY += 6;
    };

    doc.setFontSize(18);
    addText('Invoice');

    doc.setFontSize(12);
    addText(`Order ID: ${order.id ?? 'N/A'}`);
    addText(`Order Date: ${formatDate(order.createdAt)}`);
    addText(`Payment Mode: ${order.paymentMode ?? 'N/A'}`);
    cursorY += 4;

    doc.setFontSize(14);
    addText('Items');

    doc.setFontSize(12);
    cursorY += 2;
    doc.text('Name', margin, cursorY);
    doc.text('Qty', margin + 90, cursorY);
    doc.text('Price', margin + 110, cursorY);
    doc.text('Total', margin + 140, cursorY);
    cursorY += 2;
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 6;

    order.items?.forEach((item) => {
      const unitPrice = Number(
        item?.priceAtPurchase ?? item?.product?.price ?? 0
      );
      const quantity = Number(item?.quantity ?? 0);
      const itemTotal = unitPrice * quantity;

      doc.text(item?.product?.name ?? 'Item', margin, cursorY);
      doc.text(String(quantity), margin + 90, cursorY);
      doc.text(`₹${formatCurrencyValue(unitPrice)}`, margin + 110, cursorY);
      doc.text(`₹${formatCurrencyValue(itemTotal)}`, margin + 140, cursorY);
      cursorY += 6;

      if (cursorY > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        cursorY = 20;
      }
    });

    cursorY += 2;
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 10;

    doc.setFontSize(14);
    doc.text(
      `Grand Total: ₹${formatCurrencyValue(orderTotal)}`,
      pageWidth - margin,
      cursorY,
      { align: 'right' }
    );

    const invoiceFileName = `Invoice-${
      order.id?.slice(-8)?.toUpperCase() || 'ORDER'
    }.pdf`;

    doc.save(invoiceFileName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card overflow-hidden hover:shadow-[0_40px_90px_-60px_rgba(56,189,248,0.85)] transition-shadow"
    >
      {/* Order Header */}
      <div className="bg-gradient-to-r from-sky-500/90 via-indigo-500/90 to-fuchsia-500/90 text-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IoReceipt className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Order ID</span>
            </div>
            <p className="font-mono text-lg font-semibold">
              #{order.id?.slice(-8).toUpperCase()}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <IoCalendar className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Order Date</span>
            </div>
            <p className="font-semibold">{formatDate(order.createdAt)}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <paymentInfo.icon className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Payment</span>
            </div>
            <p className="font-semibold">{order.paymentMode}</p>
          </div>

          <div className="text-right">
            <div className="text-sm opacity-90 mb-1">Total Amount</div>
            <div className="text-3xl font-bold">
              ₹{formatCurrencyValue(orderTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="px-6 py-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 border border-emerald-300/30 text-emerald-200 rounded-full">
            <IoCheckmarkCircle className="w-5 h-5" />
            <span className="font-semibold tracking-wide uppercase text-xs">
              Order Confirmed
            </span>
          </div>
         
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6">
        <h3 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
          <IoCube className="w-5 h-5 text-sky-200" />
          Order Items ({order.items?.length || 0})
        </h3>

        <div className="space-y-4">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-white/5">
                <img
                  src={item.product?.image || 'https://via.placeholder.com/100'}
                  alt={item.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">
                  {item.product?.name}
                </h4>
                <p className="text-sm text-slate-400 line-clamp-1">
                  {item.product?.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-slate-400">
                    Quantity:{' '}
                    <span className="font-semibold text-slate-100">{item.quantity}</span>
                  </span>
                  <span className="text-sm text-slate-400">
                    Price:{' '}
                    <span className="font-semibold text-sky-200">
                      ₹
                      {formatCurrencyValue(
                        item.priceAtPurchase ?? item.product?.price
                      )}
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 mb-1">Total</div>
                <div className="text-xl font-semibold text-gradient">
                  ₹
                  {formatCurrencyValue(
                    Number(item.priceAtPurchase ?? item.product?.price ?? 0) *
                      Number(item.quantity ?? 0)
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex justify-center">
            <div className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 w-full max-w-md">
              <div className="text-sm text-slate-400 mb-2">Order Total Amount</div>
              <div className="font-semibold text-3xl text-gradient">
                ₹{formatCurrencyValue(orderTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            className="flex-1 px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-slate-100 hover:bg-white/15 font-semibold transition-colors"
            onClick={handleDownloadInvoice}
          >
            Download Invoice
          </button>
          <button className="flex-1 px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-slate-100 hover:bg-white/15 font-semibold transition-colors">
            Need Help?
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Orders;

