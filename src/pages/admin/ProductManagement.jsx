import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  IoAdd,
  IoCreate,
  IoTrash,
  IoSearch,
  IoArrowBack
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useProductStore } from '../../store/productStore';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

const ProductManagement = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, deleteProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = Array.isArray(products)
    ? products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDelete = async () => {
    if (!deleteModal.product) return;

    try {
      await deleteProduct(deleteModal.product._id);
      toast.success('Product deleted successfully');
      setDeleteModal({ isOpen: false, product: null });
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen gradient-bg py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.06),transparent,rgba(129,140,248,0.08))] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold text-white mb-2">
                Product <span className="text-gradient">Management</span>
              </h1>
              <p className="text-slate-400">{products.length} total products</p>
            </div>
            <Button
              variant="primary"
              icon={IoAdd}
              onClick={() => navigate('/admin/products/new')}
            >
              Add New Product
            </Button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Price
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-white/10 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={product.image || 'https://via.placeholder.com/80'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-white/15"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{product.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-400 text-sm line-clamp-2 max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sky-200">
                        ₹{product.price?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          className="p-2 text-sky-200 hover:bg-sky-400/15 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <IoCreate className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, product })}
                          className="p-2 text-rose-300 hover:bg-rose-500/15 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <IoTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No products found
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete <strong>{deleteModal.product?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteModal({ isOpen: false, product: null })}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagement;

