"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle, Edit, Trash2, Plus, Package } from 'lucide-react';

const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;
  const styles = type === 'success' ? 'bg-green-800 border-green-700 text-green-200' : 'bg-red-800 border-red-700 text-red-200';
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className={`fixed top-20 right-1/2 translate-x-1/2 z-50 p-4 rounded-md border backdrop-blur-sm shadow-lg ${styles}`}
    >
      <div className="flex items-center gap-2">
        {type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
        {message}
      </div>
    </motion.div>
  );
};

export default function ManagePackagesPage() {
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Updated default form state
  const defaultFormState = {
    serviceId: '',
    packageName: '',
    description: '', // The new description field
    quantity: '',    // The original quantity field
    unitPrice: '',
    totalPrice: '',
    displayOrder: 0,
  };
  const [formData, setFormData] = useState(defaultFormState);
  const [totalPriceManuallyEdited, setTotalPriceManuallyEdited] = useState(false);

  // Fetch both packages AND services
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pkgRes, serviceRes] = await Promise.all([
        fetch('/api/admin/packages'),
        fetch('/api/admin/services')
      ]);
      
      const pkgData = await pkgRes.json();
      const serviceData = await serviceRes.json();

      if (pkgRes.ok && pkgData.success) {
        setPackages(pkgData.data);
      } else {
        throw new Error(pkgData.error || 'Failed to fetch packages');
      }

      if (serviceRes.ok && serviceData.success) {
        setServices(serviceData.data);
        if (serviceData.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            serviceId: prev.serviceId || serviceData.data[0]._id
          }));
        }
      } else {
        throw new Error(serviceData.error || 'Failed to fetch services');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper function to clean price strings
  const parsePrice = (priceStr) => {
    if (typeof priceStr !== 'string') return 0;
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  // Auto-calculate Total Price
  useEffect(() => {
    if (totalPriceManuallyEdited) return; // Don't auto-calculate if user typed manually

    const qty = parsePrice(formData.quantity);
    const unit = parsePrice(formData.unitPrice);
    
    // Check if quantity is a "range" or "more"
    if (formData.quantity.toLowerCase().includes('more') || formData.quantity.toLowerCase().includes('-') || isNaN(qty)) {
        setFormData(prev => ({ ...prev, totalPrice: 'Negotiable' }));
        return;
    }

    if (qty > 0 && unit > 0) {
      const total = qty * unit;
      setFormData(prev => ({ ...prev, totalPrice: `৳${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }));
    }
  }, [formData.quantity, formData.unitPrice, totalPriceManuallyEdited]);


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name === 'totalPrice') {
      setTotalPriceManuallyEdited(true);
    }
    if (name === 'quantity' || name === 'unitPrice') {
      setTotalPriceManuallyEdited(false);
    }
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };
  
  const clearForm = () => {
    setEditingId(null);
    setFormData({
      ...defaultFormState,
      serviceId: services.length > 0 ? services[0]._id : ''
    });
    setTotalPriceManuallyEdited(false);
  };

  const handleEditClick = (pkg) => {
    setEditingId(pkg._id);
    setFormData({
      serviceId: pkg.serviceId._id,
      packageName: pkg.packageName,
      description: pkg.description || '', // Load new description field
      quantity: pkg.quantity,
      unitPrice: pkg.unitPrice,
      totalPrice: pkg.totalPrice,
      displayOrder: pkg.displayOrder || 0,
    });
    setTotalPriceManuallyEdited(true);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serviceId) {
      setNotification({ message: 'Error: Please select a service.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ message: editingId ? 'Package updated!' : 'Package created!', type: 'success' });
        clearForm();
        fetchData();
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      setNotification({ message: `Error: ${err.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ message: 'Package deleted.', type: 'success' });
        setPackages(prev => prev.filter(p => p._id !== id));
        if (editingId === id) clearForm();
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err) {
      setNotification({ message: `Delete failed: ${err.message}`, type: 'error' });
    }
  };

  // Group packages by service for display
  const groupedPackages = useMemo(() => {
    return packages.reduce((acc, pkg) => {
      const serviceName = pkg.serviceId?.title || 'Uncategorized';
      if (!acc[serviceName]) {
        acc[serviceName] = [];
      }
      acc[serviceName].push(pkg);
      return acc;
    }, {});
  }, [packages]);

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence>
        {notification.message && (
          <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        )}
      </AnimatePresence>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-heading uppercase text-cyan-400">
        Manage Packages
      </h1>

      {/* Add/Edit Form */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-xl mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Package className="text-cyan-400" />
                {editingId ? 'Edit Package' : 'Add New Package'}
             </h2>
             {editingId && (
                <button type="button" onClick={clearForm} className="text-sm text-neutral-400 hover:text-white">Cancel Edit</button>
             )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="serviceId" className="block text-sm font-semibold mb-2 text-neutral-300">Service *</label>
              <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleInputChange} required disabled={isSubmitting || services.length === 0}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="" disabled>Select a service</option>
                {services.map(service => (
                  <option key={service._id} value={service._id}>{service.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="packageName" className="block text-sm font-semibold mb-2 text-neutral-300">Package Name *</label>
              <input type="text" id="packageName" name="packageName" value={formData.packageName} onChange={handleInputChange} required disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., Package 01"
              />
            </div>
          </div>

          {/* ✨ NEW DESCRIPTION FIELD ✨ */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold mb-2 text-neutral-300">Description (Optional)</label>
            <input type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} disabled={isSubmitting}
              className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., Duration: max 40 sec..."
            />
          </div>
           
           {/* ✨ QUANTITY FIELD (label updated) ✨ */}
           <div>
              <label htmlFor="quantity" className="block text-sm font-semibold mb-2 text-neutral-300">Quantity *</label>
              <input type="text" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} required disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., 5 Products or 10"
              />
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-semibold mb-2 text-neutral-300">Unit Price *</label>
              <input type="text" id="unitPrice" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange} required disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., ৳4,000.00 or 4000"
              />
            </div>
             <div>
              <label htmlFor="totalPrice" className="block text-sm font-semibold mb-2 text-neutral-300">Total Price *</label>
              <input type="text" id="totalPrice" name="totalPrice" value={formData.totalPrice} onChange={handleInputChange} required disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Auto-calculated or Negotiable"
              />
            </div>
             <div>
              <label htmlFor="displayOrder" className="block text-sm font-semibold mb-2 text-neutral-300">Sort Order *</label>
              <input type="number" id="displayOrder" name="displayOrder" value={formData.displayOrder} onChange={handleInputChange} required disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          
          <button type="submit" disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (editingId ? 'Save Changes' : 'Add Package')}
          </button>
        </form>
      </div>

      {/* Packages List */}
      <h2 className="text-2xl font-semibold text-white mb-6">Existing Packages</h2>
      {isLoading ? (
        <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" size={32} /></div>
      ) : error ? (
        <div className="text-red-400 text-center mt-10"><AlertTriangle className="inline mr-2" /> {error}</div>
      ) : packages.length === 0 ? (
        <p className="text-neutral-500 text-center mt-10">No packages found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.entries(groupedPackages).map(([serviceName, pkgs]) => (
            <div key={serviceName} className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan-400 border-b border-cyan-700/50 pb-2">{serviceName}</h3>
              {pkgs.length === 0 ? <p className="text-neutral-500 italic">No packages for this service.</p> : pkgs.map(pkg => (
                  <div key={pkg._id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-start gap-4">
                      <div className="flex-grow">
                          <p className="text-sm text-neutral-400">Order: {pkg.displayOrder}</p>
                          <h4 className="font-bold text-white">{pkg.packageName} ({pkg.quantity})</h4>
                          {/* ✨ Show new description field if it exists */}
                          {pkg.description && (
                            <p className="text-sm text-neutral-400 italic mt-1">{pkg.description}</p>
                          )}
                          <p className="text-sm text-neutral-300 mt-2">Unit: {pkg.unitPrice} | Total: {pkg.totalPrice}</p>
                      </div>
                      <div className="flex-shrink-0 flex gap-2">
                          <button onClick={() => handleEditClick(pkg)} className="p-2 text-neutral-400 hover:text-cyan-400"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(pkg._id)} className="p-2 text-neutral-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                  </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}