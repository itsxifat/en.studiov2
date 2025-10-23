"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Trash2, CheckCircle, SearchX } from 'lucide-react';
import Image from 'next/image';

// Reusable Message component
const Message = ({ status, message }) => {
  if (!status) return null;
  const style = {
    success: 'bg-green-900/50 text-green-400 border-green-700',
    error: 'bg-red-900/50 text-red-400 border-red-700',
  };
  const Icon = status === 'success' ? CheckCircle : AlertTriangle;
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-24 right-1/2 translate-x-1/2 z-50 flex items-center gap-3 p-4 rounded-lg border ${style[status]} shadow-lg backdrop-blur-sm`}
    >
      <Icon size={20} />
      <p className="font-semibold">{message}</p>
    </motion.div>
  );
};

export default function ManagePhotographyPage() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ status: null, message: '' });

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/photography');
      const data = await res.json();
      if (data.success) {
        setPhotos(data.photos);
      } else {
        throw new Error(data.error || 'Failed to fetch photos.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const showNotification = (status, message) => {
    setNotification({ status, message });
    setTimeout(() => setNotification({ status: null, message: '' }), 3000);
  };

  const handleDelete = async (publicId) => {
    if (!window.confirm("Are you sure you want to permanently delete this photo?")) {
      return;
    }

    try {
      const res = await fetch('/api/admin/photography/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });

      const data = await res.json();
      if (data.success) {
        setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== publicId));
        showNotification('success', 'Photo deleted successfully.');
      } else {
        throw new Error(data.error || 'Failed to delete photo.');
      }
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 size={40} className="animate-spin text-cyan-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-neutral-900/50 border border-red-700 rounded-lg">
          <AlertTriangle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Photos</h2>
          <p className="text-neutral-400">{error}</p>
        </div>
      );
    }

    if (photos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-neutral-900/50 border border-neutral-700 rounded-lg">
          <SearchX size={48} className="text-neutral-500 mb-4" />
          <h2 className="text-2xl font-bold text-neutral-300 mb-2">No Photos Found</h2>
          <p className="text-neutral-400">Your "portfolio" folder in Cloudinary is empty.</p>
          <p className="text-neutral-500 text-sm mt-1">Head to the "Upload Photo" page to add some.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {photos.map(photo => (
            <motion.div
              layout
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative aspect-square">
                <Image
                  src={photo.thumbnail_url}
                  alt={photo.title || 'Portfolio image'}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-cyan-400 truncate" title={photo.title}>
                  {photo.title || "Untitled"}
                </p>
                <p className="text-xs text-neutral-400 truncate mt-1" title={photo.description}>
                  {photo.description || "No description"}
                </p>
                <p className="text-xs text-neutral-600 truncate mt-2 font-mono" title={photo.id}>
                  {photo.id}
                </p>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-red-500 bg-red-900/30 hover:bg-red-900/60 h-10 px-4 rounded-md transition-colors border border-red-800/50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <AnimatePresence>
        {notification.status && <Message status={notification.status} message={notification.message} />}
      </AnimatePresence>
      
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 font-heading uppercase text-cyan-400">
        Manage Photography
      </h1>
      
      {renderContent()}
    </div>
  );
}