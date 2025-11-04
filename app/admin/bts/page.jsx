"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle, Trash2, Plus, Video, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const Notification = ({ message, type, onDismiss }) => { /* ... (Same as before) ... */ };

export default function ManageBtsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [btsItems, setBtsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  // Form state
  const [btsType, setBtsType] = useState('video');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch all projects for the dropdown
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/photo-projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProjects(data.data);
        if (data.data.length > 0) {
          setSelectedProject(data.data[0]._id); // Default to first project
        }
      } else {
        throw new Error(data.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch BTS items for the *selected* project
  const fetchBtsItems = useCallback(async () => {
    if (!selectedProject) {
      setBtsItems([]);
      return;
    }
    try {
      const res = await fetch(`/api/admin/bts?projectId=${selectedProject}`);
      const data = await res.json();
      if (data.success) {
        setBtsItems(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch BTS items');
      }
    } catch (err) {
      setNotification({ message: err.message, type: 'error' });
    }
  }, [selectedProject]);

  useEffect(() => {
    fetchBtsItems();
  }, [fetchBtsItems]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const clearForm = () => {
    setDescription('');
    setUrl('');
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle SUBMITTING a new BTS item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || (btsType === 'video' && !url) || (btsType === 'image' && !file)) {
      setNotification({ message: 'Project, type, and a URL or File are required.', type: 'error' });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('projectId', selectedProject);
    formData.append('type', btsType);
    formData.append('description', description);
    if (btsType === 'video') {
      formData.append('videoUrl', url);
    } else {
      formData.append('file', file);
    }

    try {
      const res = await fetch('/api/admin/bts', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ message: 'BTS item added!', type: 'success' });
        clearForm();
        fetchBtsItems(); // Refresh the list
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      setNotification({ message: `Error: ${err.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle DELETING a BTS item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this BTS item?")) return;
    try {
      const res = await fetch(`/api/admin/bts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ message: 'BTS item deleted.', type: 'success' });
        fetchBtsItems(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err) {
      setNotification({ message: `Delete failed: ${err.message}`, type: 'error' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence>
        {notification.message && (
          <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        )}
      </AnimatePresence>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-heading uppercase text-cyan-400">
        Manage Behind The Scenes
      </h1>

      {/* Project Selector */}
      <div className="mb-8">
        <label htmlFor="projectId" className="block text-sm font-semibold mb-2 text-neutral-300">
          Select Project to Manage
        </label>
        <select
          id="projectId"
          name="projectId"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          disabled={isLoading || projects.length === 0}
          className="w-full max-w-md font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
        >
          <option value="" disabled>{isLoading ? 'Loading projects...' : 'Select a project'}</option>
          {projects.map(proj => (
            <option key={proj._id} value={proj._id}>{proj.title}</option>
          ))}
        </select>
      </div>

      {/* Add New BTS Item Form */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-xl mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Add New BTS Item</h2>
          
          {/* Type Selector */}
          <div className="flex gap-4">
            <button type="button" onClick={() => setBtsType('video')}
              className={`flex-1 p-3 rounded-lg border-2 ${btsType === 'video' ? 'border-cyan-500 bg-cyan-900/30' : 'border-neutral-700 bg-neutral-800'}`}>
              <Video className="mx-auto" />
              <span className="text-sm mt-1">YouTube Video</span>
            </button>
            <button type="button" onClick={() => setBtsType('image')}
              className={`flex-1 p-3 rounded-lg border-2 ${btsType === 'image' ? 'border-cyan-500 bg-cyan-900/30' : 'border-neutral-700 bg-neutral-800'}`}>
              <ImageIcon className="mx-auto" />
              <span className="text-sm mt-1">Image Upload</span>
            </button>
          </div>

          {/* Conditional Input */}
          <AnimatePresence mode="wait">
            {btsType === 'video' ? (
              <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label htmlFor="videoUrl" className="block text-sm font-semibold mb-2 text-neutral-300">YouTube URL or ID *</label>
                <input type="text" id="videoUrl" value={url} onChange={(e) => setUrl(e.target.value)}
                  className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., OVI3F2vaeqE"
                />
              </motion.div>
            ) : (
              <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label className="block text-sm font-semibold mb-2 text-neutral-300">Image File *</label>
                {preview && <Image src={preview} alt="Preview" width={160} height={90} className="rounded-lg object-cover aspect-video mb-2" />}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*"
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-700 file:text-neutral-300 hover:file:bg-neutral-600"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (Optional)" rows={3}
            className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500" />
          
          <button type="submit" disabled={isSubmitting || isLoading}
            className="w-full inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Add BTS Item'}
          </button>
        </form>
      </div>

      {/* Existing BTS Items List */}
      <h2 className="text-2xl font-semibold text-white mb-6">Existing BTS Items for this Project</h2>
      <div className="space-y-4">
        {btsItems.length === 0 && <p className="text-neutral-500 text-center mt-10">No BTS items found for this project.</p>}
        {btsItems.map(item => (
          <div key={item._id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-center gap-4">
            {item.type === 'image' ? (
              <Image src={item.url} alt="BTS" width={128} height={72} className="rounded object-cover aspect-video" unoptimized />
            ) : (
              <div className="w-32 h-[72px] bg-black rounded flex items-center justify-center shrink-0">
                <Video size={32} className="text-red-500" />
              </div>
            )}
            <div className="flex-grow">
              <p className="text-sm font-semibold text-white">{item.type === 'video' ? `YouTube: ${item.url}` : 'Image'}</p>
              <p className="text-sm text-neutral-400 line-clamp-2">{item.description || "No description"}</p>
            </div>
            <button onClick={() => handleDelete(item._id)} className="p-2 text-neutral-400 hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

    </div>
  );
}
// (Make sure to import/define Notification at the top)