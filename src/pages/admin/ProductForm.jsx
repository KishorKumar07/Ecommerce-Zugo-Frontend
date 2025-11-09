import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowBack, IoImage } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useProductStore } from '../../store/productStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const { currentProduct, loading, fetchProductById, createProduct, updateProduct } = useProductStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && id) {
      fetchProductById(id);
    }
  }, [id, isEdit]);

  useEffect(() => {
    if (isEdit && currentProduct) {
      setFormData({
        name: currentProduct.name || '',
        description: currentProduct.description || '',
        price: currentProduct.price || '',
        image: currentProduct.image || ''
      });
    }
  }, [currentProduct, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    // Product name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Product name must not exceed 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum)) {
        newErrors.price = 'Price must be a valid number';
      } else if (priceNum <= 0) {
        newErrors.price = 'Price must be greater than 0';
      } else if (priceNum > 1000000) {
        newErrors.price = 'Price must not exceed 1,000,000';
      }
    }

    // Image URL validation
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else {
      try {
        const url = new URL(formData.image);
       
      } catch {
        newErrors.image = 'Invalid URL format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      if (isEdit) {
        await updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  if (loading && isEdit) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen gradient-bg py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.06),transparent,rgba(129,140,248,0.08))] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center gap-2 text-slate-400 hover:text-sky-200 mb-4 font-medium transition"
          >
            <IoArrowBack className="w-5 h-5" />
            Back to Products
          </button>

          <h1 className="text-4xl font-semibold text-white mb-2">
            {isEdit ? 'Edit' : 'Add New'} <span className="text-gradient">Product</span>
          </h1>
          <p className="text-slate-400">
            {isEdit ? 'Update product information' : 'Fill in the details to create a new product'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <Input
              label="Product Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              error={errors.name}
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`input-field resize-none ${
                  errors.description ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : ''
                }`}
                placeholder="Enter product description"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-rose-300">{errors.description}</p>
              )}
            </div>

            {/* Price */}
            <Input
              label="Price (₹)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              error={errors.price}
              required
            />

            {/* Image URL */}
            <Input
              label="Image URL"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              icon={IoImage}
              error={errors.image}
              required
            />

            {/* Image Preview */}
            {formData.image && (
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Image Preview
                </label>
                <div className="relative w-full h-64 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                loading={loading}
              >
                {isEdit ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductForm;

