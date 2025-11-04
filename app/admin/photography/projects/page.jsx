"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle, Edit, Trash2, Plus, FolderHeart } from 'lucide-react';
import Image from 'next/image';

// --- Reusable Notification Component ---
const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;
  // Use professional, clean colors
  const styles = type === 'success' ? 'bg-green-800 border-green-700 text-green-200' : 'bg-red-800 border-red-700 text-red-200';
  
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-20 right-1/2 translate-x-1/2 z-50 p-4 rounded-md border backdrop-blur-sm shadow-lg ${styles}`}
    >
      <div className="flex items-center gap-2">
        {type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
        {message}
      </div>
    </motion.div>
  );
};

export default function ManagePhotoProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // null for 'Add', ID string for 'Edit'
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const thumbnailFileRef = useRef(null);

  const defaultFormState = {
    title: '',
    slug: '',
    description: '',
    thumbnail: null,
  };
  const [formData, setFormData] = useState(defaultFormState);

  // --- Function to fetch projects ---
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/photo-projects');
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setFormData(defaultFormState);
    setThumbnailPreview(null);
    if (thumbnailFileRef.current) thumbnailFileRef.current.value = "";
  };

  const handleEditClick = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      thumbnail: null, // File uploads are not re-populated
    });
    setThumbnailPreview(project.thumbnail); // Show existing thumbnail
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let url, method, body, headers;

    if (editingId) {
      // --- UPDATE (PUT) ---
      // We only send text fields for updates.
      url = `/api/admin/photo-projects/${editingId}`;
      method = 'PUT';
      headers = { 'Content-Type': 'application/json' };
      body = JSON.stringify({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
      });
    } else {
      // --- CREATE (POST) ---
      url = '/api/admin/photo-projects';
      method = 'POST';
      const apiFormData = new FormData();
      apiFormData.append('title', formData.title);
      apiFormData.append('slug', formData.slug);
      apiFormData.append('description', formData.description);
      apiFormData.append('thumbnail', formData.thumbnail);
      body = apiFormData;
      headers = undefined; // Let the browser set FormData headers
    }

    try {
      const res = await fetch(url, { method, headers, body });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ message: editingId ? 'Project updated!' : 'Project created!', type: 'success' });
        clearForm();
        fetchProjects();
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      setNotification({ message: `Error: ${err.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Function to delete a project ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will delete the project AND all associated photos (gallery & bts) permanently.")) return;

    try {
      const res = await fetch(`/api/admin/photo-projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setNotification({ message: 'Project deleted.', type: 'success' });
        setProjects(prev => prev.filter(p => p._id !== id)); // Remove from UI
        if (editingId === id) clearForm(); // Clear form if we were editing it
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err) {
       setNotification({ message: `Delete failed: ${err.message}`, type: 'error' });
    }
  };

  // --- Function to render the list of projects ---
  const renderProjectsList = () => {
    if (isLoading) {
      return <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" size={32} /></div>;
    }
    
    if (error) {
      return <div className="text-red-400 text-center mt-10 p-4 bg-red-800/20 border border-red-700 rounded-lg"><AlertTriangle className="inline mr-2" /> Error: {error}</div>;
    }
    
    if (projects.length === 0) {
      return <p className="text-neutral-500 text-center mt-10">No projects found. Add one using the form above.</p>;
    }
    
    return (
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project._id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-center gap-4">
            <Image 
              src={project.thumbnail} 
              alt={project.title} 
              width={128} 
              height={72} 
              className="rounded-md object-cover aspect-video bg-neutral-700" 
              unoptimized // Since it's from Cloudinary
            />
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-white">{project.title}</h3>
              <p className="text-sm text-cyan-400 font-mono">/{project.slug}</p>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{project.description || "No description."}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => handleEditClick(project)} 
                className="p-2 text-neutral-400 hover:text-cyan-400 transition-colors rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                aria-label="Edit"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => handleDelete(project._id)} 
                className="p-2 text-neutral-400 hover:text-red-500 transition-colors rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence>
        {notification.message && (
          <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        )}
      </AnimatePresence>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-heading uppercase text-cyan-400 flex items-center gap-4">
        <FolderHeart size={44} />
        Photo Projects
      </h1>

      {/* Add/Edit Form */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-xl mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
            {editingId && (
                <button 
                  type="button" 
                  onClick={clearForm} 
                  className="text-sm text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded p-1 -m-1"
                >
                  Cancel Edit
                </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2 text-neutral-300">Project Title *</label>
              <input 
                type="text" 
                id="title"
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="e.g., 'Urban Elegance Shoot'" 
                required 
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition" 
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-semibold mb-2 text-neutral-300">URL Slug *</label>
              <input 
                type="text" 
                id="slug"
                name="slug" 
                value={formData.slug} 
                onChange={handleInputChange} 
                placeholder="e.g., 'urban-elegance-shoot'" 
                required 
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition" 
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-semibold mb-2 text-neutral-300">Project Description</label>
            <textarea 
              id="description"
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="A brief description of the project" 
              rows={3} 
              className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-300">{editingId ? 'Current Thumbnail' : 'Project Thumbnail *'}</label>
            {thumbnailPreview && <Image src={thumbnailPreview} alt="Thumbnail preview" width={200} height={112} className="rounded-lg object-cover aspect-video mb-2" />}
            {/* Hide file input when editing, as we don't support file update via PUT */}
            {!editingId && (
              <input 
                type="file" 
                name="thumbnail" 
                ref={thumbnailFileRef} 
                onChange={handleFileChange} 
                required={!editingId} 
                disabled={isSubmitting} 
                accept="image/png, image/jpeg, image/webp"
                className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-700 file:text-neutral-300 hover:file:bg-neutral-600 transition" 
              />
            )}
            {editingId && <p className="text-xs text-neutral-500 mt-1">To change a thumbnail, please delete and re-create the project.</p>}
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (editingId ? 'Save Text Changes' : <><Plus size={20} className="mr-2" /> Add Project</>)}
          </button>
        </form>
      </div>

      {/* Existing Projects List */}
      <h2 className="text-2xl font-semibold text-white mb-6">Existing Projects</h2>
      {renderProjectsList()}
    </div>
  );
}