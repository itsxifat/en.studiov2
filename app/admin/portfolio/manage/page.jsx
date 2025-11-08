"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle, Edit, Trash2, X, Search, ListVideo } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- Notification Component ---
const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;
  const styles = type === 'success' ? 'bg-green-800 border-green-700 text-green-200' : 'bg-red-800 border-red-700 text-red-200';
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className={`fixed top-24 right-1/2 translate-x-1/2 z-[1001] p-4 rounded-md border backdrop-blur-sm shadow-lg ${styles}`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
        {message}
      </div>
    </motion.div>
  );
};

// --- Edit Video Modal ---
const EditVideoModal = ({ item, isOpen, onClose, onSave, isSubmitting, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    youtubeLink: '',
    thumbnail: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        category: item.category || '',
        description: item.description || '',
        youtubeLink: item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : '',
        thumbnail: item.thumbnail || '',
      });
    }
  }, [item]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item._id, formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
            <h3 className="text-lg font-semibold text-white">Edit Video Project</h3>
            <button type="button" onClick={onClose} className="text-neutral-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2 text-neutral-300">Project Title *</label>
              <input id="title" name="title" value={formData.title} onChange={handleChange} required className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-[#53A4DB]" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-semibold mb-2 text-neutral-300">Category *</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-[#53A4DB]">
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2 text-neutral-300">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-[#53A4DB]" />
            </div>
            <div>
              <label htmlFor="youtubeLink" className="block text-sm font-semibold mb-2 text-neutral-300">YouTube Link</label>
              <input id="youtubeLink" name="youtubeLink" value={formData.youtubeLink} onChange={handleChange} type="url" placeholder="https://www.youtube.com/watch?v=..." className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-[#53A4DB]" />
            </div>
             <div>
              <label htmlFor="thumbnail" className="block text-sm font-semibold mb-2 text-neutral-300">Custom Thumbnail URL (Optional)</label>
              <input id="thumbnail" name="thumbnail" value={formData.thumbnail} onChange={handleChange} type="url" placeholder="https://.../image.jpg" className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-[#53A4DB]" />
              <p className="text-xs mt-1 text-neutral-500">Leave blank to auto-generate from YouTube link.</p>
            </div>
          </div>
          <div className="p-4 bg-neutral-800/50 border-t border-neutral-800 flex justify-end gap-3 sticky bottom-0">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-700 hover:bg-neutral-600 rounded-md transition disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-black bg-[#53A4DB] hover:bg-cyan-600 rounded-md transition disabled:opacity-50 flex items-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- Main Page Component ---
export default function ManageVideoPortfolioPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ status: null, message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✨ UPDATED fetchAllData to call the new secure admin route
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [itemRes, catRes] = await Promise.all([
        fetch('/api/admin/portfolio'), // ✨ Use secure route
        fetch('/api/admin/category')
      ]);
      
      const itemData = await itemRes.json();
      const catData = await catRes.json();

      if (itemRes.ok && itemData.success) {
        setItems(itemData.data);
      } else {
        throw new Error(itemData.error || 'Failed to fetch portfolio items');
      }
      
      if (catRes.ok && catData.success) {
        setCategories(catData.data.filter(c => c.name !== 'All'));
      } else {
        throw new Error(catData.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const showNotification = (status, message) => {
    setNotification({ status, message });
    setTimeout(() => setNotification({ status: null, message: '' }), 3000);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // ✨ This function will now work correctly
  const handleSaveEdit = async (id, formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Project updated.');
        handleCloseModal();
        fetchAllData();
      } else {
        throw new Error(data.error || 'Failed to update item.'); // Corrected message
      }
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✨ This function will now work correctly
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this video project?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setItems(prevItems => prevItems.filter(p => p._id !== id));
        showNotification('success', 'Video project deleted.');
      } else {
        throw new Error(data.error || 'Failed to delete item.'); // Corrected message
      }
    } catch (err) {
      showNotification('error', err.message);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 size={40} className="animate-spin text-[#53A4DB]" /></div>;
    }
    if (error) {
      return <div className="text-center p-8 bg-neutral-900/50 border border-red-700 rounded-lg text-red-400"><AlertTriangle size={48} className="mx-auto mb-4" />{error}</div>;
    }
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-neutral-900/50 border border-neutral-700 rounded-lg">
          <SearchX size={48} className="text-neutral-500 mb-4" />
          <h2 className="text-2xl font-bold text-neutral-300 mb-2">No Video Projects Found</h2>
          <p className="text-neutral-400">Please <Link href="/admin/portfolio" className="text-[#53A4DB] hover:underline">add a video project</Link> first.</p>
        </div>
      );
    }

    return (
      <>
        {/* --- Desktop Table --- */}
        <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
          <table className="w-full divide-y divide-neutral-800">
            <thead className="bg-neutral-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Thumbnail</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Category</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              <AnimatePresence>
                {filteredItems.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-10 text-neutral-500">No items match your search.</td></tr>
                )}
                {filteredItems.map(item => (
                  <motion.tr layout key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Image src={item.thumbnail || '/placeholder.jpg'} alt={item.title} width={106} height={60} className="rounded object-cover aspect-video bg-neutral-700" unoptimized />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-neutral-400 font-mono">{item.youtubeId || "No Video ID"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2 py-1 text-xs font-semibold rounded-full bg-cyan-900/50 text-[#53A4DB] border border-cyan-700/50">
                        {item.category}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleEditClick(item)} className="p-2 text-neutral-400 hover:text-[#53A4DB]"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-neutral-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* --- Mobile Card List --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          <AnimatePresence>
            {filteredItems.length === 0 && (
                <p className="text-center py-10 text-neutral-500 col-span-full">No items match your search.</p>
            )}
            {filteredItems.map(item => (
              <motion.div layout key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden"
              >
                <Image src={item.thumbnail || '/placeholder.jpg'} alt={item.title} width={300} height={169} className="w-full object-cover aspect-video bg-neutral-700" unoptimized />
                <div className="p-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-cyan-900/50 text-[#53A4DB] border border-cyan-700/50">
                    {item.category}
                  </span>
                  <h3 className="text-base font-semibold text-white mt-2 truncate">{item.title}</h3>
                  <p className="text-xs text-neutral-400 font-mono truncate">{item.youtubeId || "No Video ID"}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleEditClick(item)} className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#53A4DB] bg-cyan-900/30 hover:bg-cyan-900/60 h-10 px-4 rounded-md transition-colors border border-cyan-800/50">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-red-500 bg-red-900/30 hover:bg-red-900/60 h-10 px-4 rounded-md transition-colors border border-red-800/50">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <AnimatePresence>
        {notification.message && <Notification message={notification.message} type={notification.status} onDismiss={() => setNotification({ status: null, message: '' })} />}
      </AnimatePresence>
      
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-heading uppercase text-[#53A4DB] flex items-center gap-4">
          <ListVideo size={44} />
          Manage Videos
        </h1>
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-[#53A4DB] focus:border-[#53A4DB] focus:outline-none transition text-white"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        </div>
      </div>
      
      {renderContent()}

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingItem && (
          <EditVideoModal
            item={editingItem}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveEdit}
            isSubmitting={isSubmitting}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}