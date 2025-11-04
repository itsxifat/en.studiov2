"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Trash2, CheckCircle, SearchX, ArrowLeft, Edit, X, Camera } from 'lucide-react';
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
      className={`fixed top-24 right-1/2 translate-x-1/2 z-50 p-4 rounded-md border backdrop-blur-sm shadow-lg ${styles}`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
        {message}
      </div>
    </motion.div>
  );
};

// --- Edit Photo Modal ---
const EditPhotoModal = ({ photo, isOpen, onClose, onSave, isSubmitting }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    if (photo) {
      setFormData({
        title: photo.title || '',
        description: photo.description || '',
      });
    }
  }, [photo]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(photo._id, formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b border-neutral-800">
            <h3 className="text-lg font-semibold text-white">Edit Photo Details</h3>
            <button type="button" onClick={onClose} className="text-neutral-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <Image src={photo.imageUrl} alt="Editing photo" width={200} height={200} className="w-full h-auto max-h-64 object-contain rounded-md bg-black" unoptimized />
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2 text-neutral-300">Title</label>
              <input
                id="title" name="title" value={formData.title} onChange={handleChange}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2 text-neutral-300">Description</label>
              <textarea
                id="description" name="description" value={formData.description} onChange={handleChange} rows={3}
                className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="p-4 bg-neutral-800/50 border-t border-neutral-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-700 hover:bg-neutral-600 rounded-md transition disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-black bg-cyan-500 hover:bg-cyan-400 rounded-md transition disabled:opacity-50 flex items-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- Project List Component ---
const ProjectList = ({ projects, onProjectClick, isLoading, error }) => {
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 size={40} className="animate-spin text-cyan-500" /></div>;
  }
  if (error) {
    return <div className="text-center p-8 bg-neutral-900/50 border border-red-700 rounded-lg text-red-400"><AlertTriangle size={48} className="mx-auto mb-4" />{error}</div>;
  }
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-neutral-900/50 border border-neutral-700 rounded-lg">
        <SearchX size={48} className="text-neutral-500 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-300 mb-2">No Photo Projects Found</h2>
        <p className="text-neutral-400">Please <Link href="/admin/photography/projects" className="text-cyan-400 hover:underline">create a project</Link> first to manage its photos.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {projects.map(project => (
          <motion.div
            layout key={project._id}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onClick={() => onProjectClick(project)}
            className="group relative cursor-pointer bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-lg transition-all hover:border-cyan-700 hover:shadow-cyan-500/10"
          >
            <div className="relative aspect-video">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{project.title}</h3>
              <p className="text-sm text-neutral-400 truncate mt-1">{project.description || "No description"}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Photo Grid Component ---
const ProjectPhotoGrid = ({ project, onBack, onEdit, onDelete, photos, isLoading, error }) => {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>
      <h2 className="text-3xl font-bold text-white mb-8">Managing: <span className="text-cyan-400">{project.title}</span></h2>

      {isLoading && <div className="flex justify-center items-center min-h-[50vh]"><Loader2 size={40} className="animate-spin text-cyan-500" /></div>}
      {error && <div className="text-center p-8 bg-neutral-900/50 border border-red-700 rounded-lg text-red-400"><AlertTriangle size={48} className="mx-auto mb-4" />{error}</div>}
      
      {!isLoading && !error && photos.length === 0 && (
         <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-8 bg-neutral-900/50 border border-neutral-700 rounded-lg">
          <SearchX size={48} className="text-neutral-500 mb-4" />
          <h2 className="text-2xl font-bold text-neutral-300 mb-2">No Photos Found</h2>
          <p className="text-neutral-400">This project is empty. <Link href="/admin/photography/upload" className="text-cyan-400 hover:underline">Upload photos</Link> to see them here.</p>
        </div>
      )}
      
      {!isLoading && !error && photos.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {photos.map(photo => (
              <motion.div
                layout key={photo._id}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative aspect-square">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title || 'Portfolio image'}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-cyan-400 truncate" title={photo.title}>{photo.title || "Untitled"}</p>
                  <p className="text-xs text-neutral-400 truncate mt-1" title={photo.description}>{photo.description || "No description"}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => onEdit(photo)}
                      className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-cyan-400 bg-cyan-900/30 hover:bg-cyan-900/60 h-10 px-4 rounded-md transition-colors border border-cyan-800/50"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(photo._id, photo.publicId)}
                      className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-red-500 bg-red-900/30 hover:bg-red-900/60 h-10 px-4 rounded-md transition-colors border border-red-800/50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};


// --- Main Page Component ---
export default function ManagePhotographyPage() {
  const [projects, setProjects] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // null = project view, object = photo view
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [error, setError] = useState(null); // For both project and photo loading
  const [notification, setNotification] = useState({ status: null, message: '' });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch projects on load
  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/photo-projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch projects.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch photos when a project is selected
  const fetchPhotosForProject = useCallback(async (projectId) => {
    setIsLoadingPhotos(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/photos?projectId=${projectId}`);
      const data = await res.json();
      if (data.success) {
        setPhotos(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch photos.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingPhotos(false);
    }
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    fetchPhotosForProject(project._id);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setPhotos([]);
    setError(null);
  };

  const showNotification = (status, message) => {
    setNotification({ status, message });
    setTimeout(() => setNotification({ status: null, message: '' }), 3000);
  };

  // Handle opening the edit modal
  const handleEdit = (photo) => {
    setEditingPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPhoto(null);
  };

  // Handle saving changes from the edit modal
  const handleSaveEdit = async (photoId, formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/photos/${photoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setPhotos(prev => prev.map(p => p._id === photoId ? { ...p, ...formData } : p));
        showNotification('success', 'Photo details updated.');
        handleCloseModal();
      } else {
        throw new Error(data.error || 'Failed to update photo.');
      }
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a photo
  const handleDelete = async (photoId, publicId) => {
    if (!window.confirm("Are you sure you want to permanently delete this photo?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/photos/${photoId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        setPhotos(prevPhotos => prevPhotos.filter(p => p._id !== photoId));
        showNotification('success', 'Photo deleted successfully.');
      } else {
        throw new Error(data.error || 'Failed to delete photo.');
      }
    } catch (err) {
      showNotification('error', err.message);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <AnimatePresence>
        {notification.status && <Notification message={notification.message} type={notification.status} onDismiss={() => setNotification({ status: null, message: '' })} />}
      </AnimatePresence>
      
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 font-heading uppercase text-cyan-400 flex items-center gap-4">
        <Camera size={44} />
        Manage Photography
      </h1>
      
      <AnimatePresence mode="wait">
        {selectedProject ? (
          // --- View 2: Photo Grid ---
          <motion.div
            key="photo-grid"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ProjectPhotoGrid
              project={selectedProject}
              photos={photos}
              isLoading={isLoadingPhotos}
              error={error}
              onBack={handleBackToProjects}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </motion.div>
        ) : (
          // --- View 1: Project List ---
          <motion.div
            key="project-list"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ProjectList
              projects={projects}
              onProjectClick={handleProjectClick}
              isLoading={isLoadingProjects}
              error={error}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingPhoto && (
          <EditPhotoModal
            photo={editingPhoto}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveEdit}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}