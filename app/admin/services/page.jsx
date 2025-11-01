"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle, Edit, Trash2, Plus, Layers } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const IconMap = { ...LucideIcons, default: Layers };
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

export default function ManageServicesPage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultFormState = {
    title: '',
    description: '',
    icon: 'Layers',
    startingPrice: '',
    displayOrder: 0,
  };
  const [formData, setFormData] = useState(defaultFormState);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (res.ok && data.success) {
        setServices(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch services');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };
  
  const clearForm = () => {
    setEditingId(null);
    setFormData(defaultFormState);
  };

  const handleEditClick = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      startingPrice: service.startingPrice,
      displayOrder: service.displayOrder || 0,
    });
    window.scrollTo(0, 0);
  };

  // --- ✨ THIS IS THE CRITICAL FUNCTION ✨ ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Determine the correct URL and Method based on whether we are editing or adding
    const url = editingId 
      ? `/api/admin/services/${editingId}` // For UPDATING an existing item
      : '/api/admin/services';           // For CREATING a new item
    
    const method = editingId ? 'PUT' : 'POST'; // PUT to update, POST to create

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ message: editingId ? 'Service updated!' : 'Service created!', type: 'success' });
        clearForm();
        fetchServices();
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
    if (!window.confirm("Are you sure? This will also delete all packages linked to this service.")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' }); // Uses the [id] route
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ message: 'Service deleted.', type: 'success' });
        setServices(prev => prev.filter(s => s._id !== id));
        if (editingId === id) clearForm();
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err) {
      setNotification({ message: `Delete failed: ${err.message}`, type: 'error' });
    }
  };

  const FormIcon = IconMap[formData.icon] || Layers;

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {notification.message && (
          <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        )}
      </AnimatePresence>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-heading uppercase text-cyan-400">
        Manage Services
      </h1>

      {/* Form Section */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-xl mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <FormIcon className="text-cyan-400" />
                {editingId ? 'Edit Service' : 'Add New Service'}
             </h2>
             {editingId && (
                <button type="button" onClick={clearForm} className="text-sm text-neutral-400 hover:text-white">Cancel Edit</button>
             )}
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-semibold mb-2 text-neutral-300">Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required maxLength={100} disabled={isSubmitting}
              className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="icon" className="block text-sm font-semibold mb-2 text-neutral-300">Icon Name *</label>
              <input type="text" id="icon" name="icon" value={formData.icon} onChange={handleInputChange} required maxLength={50} disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-xs mt-1 text-neutral-500">e.g., &quot;Film&quot;, &quot;Camera&quot; (from lucide.dev)</p>
            </div>
             <div>
              <label htmlFor="startingPrice" className="block text-sm font-semibold mb-2 text-neutral-300">Starting Price *</label>
              <input type="text" id="startingPrice" name="startingPrice" value={formData.startingPrice} onChange={handleInputChange} required maxLength={50} disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., 4,000 or Negotiable"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-semibold mb-2 text-neutral-300">Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={3} maxLength={500} disabled={isSubmitting}
              className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="displayOrder" className="block text-sm font-semibold mb-2 text-neutral-300">Display Order *</label>
            <input type="number" id="displayOrder" name="displayOrder" value={formData.displayOrder} onChange={handleInputChange} required disabled={isSubmitting}
              className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <button type="submit" disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (editingId ? 'Save Changes' : 'Add Service')}
          </button>
        </form>
      </div>

      {/* Existing Services List */}
      <h2 className="text-2xl font-semibold text-white mb-6">Existing Services</h2>
      {isLoading ? (
        <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" size={32} /></div>
      ) : error ? (
        <div className="text-red-400 text-center mt-10"><AlertTriangle className="inline mr-2" /> Error: {error}</div>
      ) : services.length === 0 ? (
        <p className="text-neutral-500 text-center mt-10">No services found.</p>
      ) : (
        <div className="space-y-4">
          {services.map(service => {
            const ServiceIcon = IconMap[service.icon] || Layers;
            return (
              <div key={service._id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-start gap-4">
                <ServiceIcon className="text-cyan-400 w-6 h-6 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-white">(Order: {service.displayOrder}) {service.title}</h3>
                  <p className="text-sm text-neutral-400 mb-2">{service.description}</p>
                  <p className="text-sm font-semibold text-cyan-400">Starting at ৳{service.startingPrice}</p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <button onClick={() => handleEditClick(service)} className="p-2 text-neutral-400 hover:text-cyan-400"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(service._id)} className="p-2 text-neutral-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}