"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Star, Image as ImageIcon, Video, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link

// Notification component: Displays messages for success/error
const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;
  const styles = type === 'success'
    ? 'bg-green-800/50 border-green-700 text-green-200'
    : 'bg-red-800/50 border-red-700 text-red-200';
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

// Reusable Card component: Displays individual video or photo projects
const ItemCard = ({ item, togglingId, onToggle }) => {
  const itemId = item?._id;
  const itemType = item?.type;
  const itemThumbnail = item?.thumbnail || '/placeholder.jpg';
  const itemTitle = item?.title || 'Untitled';
  const isFeatured = typeof item?.isFeatured === 'boolean' ? item.isFeatured : false;
  const isToggling = togglingId === itemId;

  const handleButtonClick = () => {
    // Check if essential data exists
    if (itemId && itemType && typeof isFeatured === 'boolean') {
      onToggle(item);
    } else {
      console.error("ItemCard: Invalid item data passed to onToggle", item);
    }
  };

  return (
    <motion.div
      layout
      key={itemId || Math.random()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-lg flex flex-col"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-neutral-800">
        <Image
          src={itemThumbnail}
          alt={itemTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          // ✨ FIX: Correctly check for both Cloudinary and YouTube
          unoptimized={itemThumbnail.includes('cloudinary') || itemThumbnail.includes('img.youtube.com')}
          priority={false}
        />
        {/* Icon indicating item type (Video or PhotoProject) */}
        <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full backdrop-blur-sm">
          {itemType === 'video' ? (
            <Video size={16} className="text-cyan-400" />
          ) : (
            // ✨ Use ImageIcon for 'photoProject'
            <ImageIcon size={16} className="text-purple-400" />
          )}
        </div>
      </div>
      {/* Card Content Area */}
      <div className="p-4 flex flex-col grow">
        <p className="text-sm font-semibold text-neutral-200 truncate grow" title={itemTitle}>
          {itemTitle}
        </p>
        <button
          onClick={handleButtonClick}
          disabled={isToggling}
          className={`w-full mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold h-10 px-4 rounded-md transition-colors border ${
            isFeatured
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-700/50 hover:bg-yellow-500/30'
              : 'bg-neutral-800/50 text-neutral-400 border-neutral-700 hover:bg-neutral-700/70 hover:text-neutral-200'
          } ${isToggling ? 'cursor-wait opacity-50' : ''}`}
        >
          {isToggling ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Star size={16} fill={isFeatured ? 'currentColor' : 'none'} />
          )}
          {isFeatured ? 'Featured' : 'Mark as Featured'}
        </button>
      </div>
    </motion.div>
  );
};


export default function ManageFeaturedPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [togglingId, setTogglingId] = useState(null);

  // Function to fetch all items from the backend API
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/featured');
      const data = await res.json();
      if (res.ok && data.success) {
        // ✨ FIX: Filter for valid items, now including 'photoProject'
        const validItems = Array.isArray(data.data) ? data.data.filter(
          i => i && i._id && (i.type === 'video' || i.type === 'photoProject') && typeof i.isFeatured === 'boolean'
        ) : [];
        
        if(Array.isArray(data.data) && validItems.length !== data.data.length) {
           console.warn("Filtered out invalid items during fetch:", data.data.length - validItems.length);
        }
        setItems(validItems);
      } else {
        throw new Error(data.error || 'Failed to fetch items.');
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Function to handle toggling the 'isFeatured' status
  const handleToggleFeatured = async (item) => {
    if (item?._id == null || !item?.type || typeof item?.isFeatured !== 'boolean') {
        console.error("handleToggleFeatured: Received invalid item object:", item);
        setNotification({ message: 'Error: Cannot toggle, item data invalid.', type: 'error' });
        return;
    }

    if (togglingId) return;
    setTogglingId(item._id);

    try {
      const res = await fetch('/api/admin/featured/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item._id,
          type: item.type, // This will be 'video' or 'photoProject'
          currentFeaturedStatus: item.isFeatured,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Update local state
        setItems(prevItems =>
          prevItems.map(i =>
            i._id === item._id ? { ...i, isFeatured: data.data.isFeatured } : i
          )
        );
        setNotification({ message: 'Status updated successfully!', type: 'success' });
      } else {
        console.error("API Toggle Error Response:", data);
        throw new Error(data.error || 'Failed to toggle status.');
      }
    } catch (err) {
      console.error("Caught Error during toggle:", err);
      setNotification({ message: `Update failed: ${err.message}`, type: 'error' });
    } finally {
      setTogglingId(null);
    }
  };

  // Separate items into videos and photoProjects
  const videoItems = useMemo(() => items.filter(item => item.type === 'video'), [items]);
  // ✨ FIX: Filter for 'photoProject' instead of 'photo'
  const photoProjectItems = useMemo(() => items.filter(item => item.type === 'photoProject'), [items]);

  // Function to render the main content
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
         <div className="text-center p-8 bg-neutral-900/50 border border-red-700 rounded-lg">
           <AlertTriangle size={48} className="text-red-500 mb-4 mx-auto" />
           <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Items</h2>
           <p className="text-neutral-400">{error}</p>
         </div>
      );
    }
     if (items.length === 0) {
       return (
         <div className="text-center p-8 bg-neutral-900/50 border border-neutral-700 rounded-lg">
           <h2 className="text-2xl font-bold text-neutral-300 mb-2">No Items Found</h2>
           <p className="text-neutral-400">Upload videos or <Link href="/admin/photography/projects" className="text-cyan-400 hover:underline">create photo projects</Link> first.</p>
         </div>
       );
     }

    // Render the two-column layout
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Video Column */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-neutral-300 border-b border-neutral-700 pb-2 flex items-center gap-2">
            <Video className="text-cyan-400" /> Video Projects
          </h2>
          {videoItems.length === 0 ? (
             <p className="text-neutral-500 italic">No videos found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                 {videoItems.map(item => (
                   <ItemCard key={item._id} item={item} togglingId={togglingId} onToggle={handleToggleFeatured} />
                 ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ✨ UPDATED: Photo Project Column */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-neutral-300 border-b border-neutral-700 pb-2 flex items-center gap-2">
            <ImageIcon className="text-purple-400" /> Photo Projects
          </h2>
          {photoProjectItems.length === 0 ? (
             <p className="text-neutral-500 italic">No photo projects found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                  {photoProjectItems.map(item => (
                    <ItemCard key={item._id} item={item} togglingId={togglingId} onToggle={handleToggleFeatured} />
                  ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    );
  };

  // Render the overall page structure
  return (
    <div className="max-w-7xl mx-auto">
       <AnimatePresence>
        {notification.message && (
          <Notification
            message={notification.message}
            type={notification.type}
            onDismiss={() => setNotification({ message: '', type: '' })}
          />
        )}
      </AnimatePresence>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 font-heading uppercase text-cyan-400">
        Manage Featured Work
      </h1>
      {renderContent()}
    </div>
  );
}