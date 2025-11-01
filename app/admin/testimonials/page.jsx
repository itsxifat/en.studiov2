"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle, Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

// --- Reusable Components ---

// Notification Component (same as before)
const Notification = ({ message, type, onDismiss }) => { /* ... Keep code ... */ };

// Modal Component for Add/Edit Form
const TestimonialModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({ quote: '', name: '', project: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          quote: initialData.quote || '',
          name: initialData.name || '',
          project: initialData.project || '',
        });
        setPreview(initialData.photo || null);
      } else {
        // Reset form for adding new
        setFormData({ quote: '', name: '', project: '' });
        setPreview(null);
      }
      setFile(null); // Reset file input on open
      setRemovePhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
             alert('File is too large (Max 5MB).'); // Simple alert for now
             clearFile();
             return;
        }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setRemovePhoto(false); // If new file selected, don't remove existing photo
    }
  };

  const clearFile = (clearExistingPreview = true) => {
    setFile(null);
    if (clearExistingPreview) setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePhoto = () => {
    clearFile();
    setRemovePhoto(true); // Mark photo for removal on submit
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.quote || !formData.name) {
        alert("Quote and Name are required."); // Basic validation
        return;
    }
    const submissionData = new FormData();
    submissionData.append('quote', formData.quote);
    submissionData.append('name', formData.name);
    submissionData.append('project', formData.project);
    if (file) {
      submissionData.append('file', file);
    } else if (removePhoto) {
      submissionData.append('remove_photo', 'true');
    }
    onSubmit(submissionData, initialData?._id); // Pass FormData and ID if editing
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              {initialData ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
            <button type="button" onClick={onClose} className="text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Quote */}
            <div>
              <label htmlFor="quote" className="block text-sm font-semibold mb-1 text-neutral-300">Quote *</label>
              <textarea
                id="quote" name="quote" rows={4} required maxLength={500}
                value={formData.quote} onChange={handleInputChange} disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-2 rounded-md focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
              />
            </div>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1 text-neutral-300">Client Name *</label>
              <input
                id="name" name="name" type="text" required maxLength={100}
                value={formData.name} onChange={handleInputChange} disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-2 rounded-md focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
              />
            </div>
             {/* Project */}
            <div>
              <label htmlFor="project" className="block text-sm font-semibold mb-1 text-neutral-300">Project/Company (Optional)</label>
              <input
                id="project" name="project" type="text" maxLength={100}
                value={formData.project} onChange={handleInputChange} disabled={isSubmitting}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-2 rounded-md focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
              />
            </div>
            {/* Photo Upload */}
            <div>
               <label className="block text-sm font-semibold mb-1 text-neutral-300">Client Photo (Optional)</label>
               <div className="mt-1 flex items-center gap-4">
                    <div className="shrink-0 w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
                      {preview ? (
                        <Image src={preview} alt="Preview" width={64} height={64} className="object-cover w-full h-full" />
                      ) : (
                        <ImageIcon size={24} className="text-neutral-500" />
                      )}
                    </div>
                    <div className="grow">
                         <input
                            type="file"
                            className="sr-only"
                            id="file-upload"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            disabled={isSubmitting}
                         />
                         <button
                           type="button"
                           onClick={() => fileInputRef.current?.click()}
                           disabled={isSubmitting}
                           className="text-sm font-medium text-cyan-400 hover:text-cyan-300 bg-neutral-800/50 border border-neutral-700 px-3 py-1.5 rounded-md transition"
                         >
                           {preview ? 'Change' : 'Upload Image'}
                         </button>
                         {preview && (
                              <button
                                 type="button"
                                 onClick={handleRemovePhoto}
                                 disabled={isSubmitting}
                                 className="ml-2 text-sm font-medium text-red-500 hover:text-red-400"
                              >
                                Remove
                              </button>
                         )}
                         <p className="text-xs text-neutral-500 mt-1">Max 5MB (PNG, JPG, GIF, WebP)</p>
                    </div>
               </div>
            </div>
          </div>

          <div className="p-6 border-t border-neutral-800 flex justify-end gap-3">
            <button
              type="button" onClick={onClose} disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-700 hover:bg-neutral-600 rounded-md transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-black bg-cyan-500 hover:bg-cyan-400 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {initialData ? 'Save Changes' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};


// --- Main Page Component ---
export default function ManageTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null); // null for add, object for edit
  const [isSubmitting, setIsSubmitting] = useState(false); // For modal form

  // Fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonials(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch testimonials');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Handle opening modal for adding
  const handleAdd = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  // Handle opening modal for editing
  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  // Handle form submission (Add or Edit)
  const handleSubmit = async (formData, id = null) => {
    setIsSubmitting(true);
    const url = id ? `/api/admin/testimonials/${id}` : '/api/admin/testimonials';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: formData }); // FormData is sent directly
      const data = await res.json();

      if (res.ok && data.success) {
        setNotification({ message: id ? 'Testimonial updated!' : 'Testimonial added!', type: 'success' });
        handleCloseModal();
        fetchTestimonials(); // Re-fetch the list
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error("Submission error:", err);
      setNotification({ message: `Error: ${err.message}`, type: 'error' });
      // Keep modal open on error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a testimonial
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    // Instantly remove from UI for perceived speed (optimistic update)
    const originalTestimonials = [...testimonials];
    setTestimonials(prev => prev.filter(t => t._id !== id));

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        // If delete fails, revert UI and show error
        setTestimonials(originalTestimonials);
        throw new Error(data.error || 'Failed to delete');
      }
      setNotification({ message: 'Testimonial deleted.', type: 'success' });
      // No need to refetch if optimistic update worked
    } catch (err) {
       console.error("Delete error:", err);
       setTestimonials(originalTestimonials); // Revert UI on error
       setNotification({ message: `Delete failed: ${err.message}`, type: 'error' });
    }
  };

  // Render main content
  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" size={32} /></div>;
    if (error) return <div className="text-red-400 text-center mt-10"><AlertTriangle className="inline mr-2" /> Error: {error}</div>;
    if (testimonials.length === 0) return <p className="text-neutral-500 text-center mt-10">No testimonials found. Add one!</p>;

    return (
      <div className="mt-6 space-y-4">
        {testimonials.map(t => (
          <motion.div
            layout
            key={t._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 flex items-start gap-4"
          >
            <div className="shrink-0 w-12 h-12 rounded-full bg-neutral-700 overflow-hidden">
              {t.photo ? (
                <Image src={t.photo} alt={t.name} width={48} height={48} className="object-cover w-full h-full" />
              ) : (
                 <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={20} className="text-neutral-500" />
                 </div>
              )}
            </div>
            <div className="grow">
              <blockquote className="italic text-neutral-300">&quot;{t.quote}&quot;</blockquote>
              <p className="mt-2 text-sm">
                <span className="font-semibold text-white">{t.name}</span>
                {t.project && <span className="text-neutral-400"> – {t.project}</span>}
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-2">
               <button
                 onClick={() => handleEdit(t)}
                 className="p-2 text-neutral-400 hover:text-cyan-400 transition rounded-md hover:bg-neutral-700"
                 aria-label="Edit"
               >
                 <Edit size={16} />
               </button>
               <button
                 onClick={() => handleDelete(t._id)}
                 className="p-2 text-neutral-400 hover:text-red-500 transition rounded-md hover:bg-neutral-700"
                 aria-label="Delete"
               >
                  <Trash2 size={16} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Notifications */}
      <AnimatePresence>
        {notification.message && (
          <Notification
            message={notification.message}
            type={notification.type}
            onDismiss={() => setNotification({ message: '', type: '' })}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-heading uppercase text-cyan-400">
          Manage Testimonials
        </h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg transition text-sm"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Content Area */}
      {renderContent()}

      {/* Add/Edit Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingTestimonial}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}