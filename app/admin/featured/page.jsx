"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Star, Image as ImageIcon, Video } from 'lucide-react';
import Image from 'next/image';

// Notification component: Displays messages for success/error
const Notification = ({ message, type, onDismiss }) => {
  // Don't render if there's no message
  if (!message) return null;

  // Determine styling based on notification type
  const styles = type === 'success'
    ? 'bg-green-900/70 border-green-700 text-green-300' // Success style
    : 'bg-red-900/70 border-red-700 text-red-300'; // Error style

  // Set a timer to automatically dismiss the notification
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000); // Dismiss after 3 seconds
    return () => clearTimeout(timer); // Clear timer on unmount
  }, [onDismiss]);

  // Render the notification with animations
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} // Initial animation state (invisible, slightly above)
      animate={{ opacity: 1, y: 0 }} // Animate to visible and original position
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }} // Animate out
      className={`fixed top-20 right-1/2 translate-x-1/2 z-50 p-4 rounded-md border backdrop-blur-sm shadow-lg ${styles}`} // Styling
    >
      {message}
    </motion.div>
  );
};

// Reusable Card component: Displays individual video or photo items
const ItemCard = ({ item, togglingId, onToggle }) => {
  // Safely access item properties using optional chaining (?.)
  const itemId = item?._id;
  const itemType = item?.type;
  const itemThumbnail = item?.thumbnail || '/placeholder.jpg'; // Use placeholder if thumbnail missing
  const itemTitle = item?.title || 'Untitled'; // Default title
  const isFeatured = typeof item?.isFeatured === 'boolean' ? item.isFeatured : false; // Default isFeatured to false if missing/invalid

  // Determine if the current item is the one being toggled
  const isToggling = togglingId === itemId;

  // Handle button click, ensuring valid data before calling onToggle
  const handleButtonClick = () => {
    // Check if essential data exists before proceeding
    if (itemId && itemType && typeof isFeatured === 'boolean') {
      onToggle(item); // Call the parent's toggle function
    } else {
      console.error("ItemCard: Invalid item data passed to onToggle", item);
      // Optionally, show an error to the user directly on the card or trigger a notification
    }
  };

  return (
    <motion.div
      layout // Enable smooth layout transition animations
      key={itemId || Math.random()} // Use ID as key, fallback if needed
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
          fill // Make image fill the container
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" // Responsive image sizes
          className="object-cover" // Ensure image covers the area
          // Disable Next.js optimization if URL is external and already optimized
          unoptimized={itemThumbnail.includes('cloudinary') || itemThumbnail.includes('img.youtube.com')}
          priority={false} // Avoid too many priority images for performance
        />
        {/* Icon indicating item type (Video or Photo) */}
        <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full backdrop-blur-sm">
          {itemType === 'video' ? (
            <Video size={16} className="text-cyan-400" />
          ) : (
            <ImageIcon size={16} className="text-purple-400" />
          )}
        </div>
      </div>
      {/* Card Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Item Title (truncated) */}
        <p className="text-sm font-semibold text-neutral-200 truncate flex-grow" title={itemTitle}>
          {itemTitle}
        </p>
        {/* Toggle Featured Button */}
        <button
          onClick={handleButtonClick} // Use the safe handler
          disabled={isToggling} // Disable button while this item is processing
          className={`w-full mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold h-10 px-4 rounded-md transition-colors border ${
            isFeatured // Conditional styling based on featured status
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-700/50 hover:bg-yellow-500/30'
              : 'bg-neutral-800/50 text-neutral-400 border-neutral-700 hover:bg-neutral-700/70 hover:text-neutral-200'
          } ${isToggling ? 'cursor-wait opacity-50' : ''}`} // Styling for loading state
        >
          {isToggling ? ( // Show loader if this item is processing
            <Loader2 size={16} className="animate-spin" />
          ) : ( // Show star icon otherwise
            <Star size={16} fill={isFeatured ? 'currentColor' : 'none'} />
          )}
          {isFeatured ? 'Featured' : 'Mark as Featured'} {/* Button text */}
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
  const [togglingId, setTogglingId] = useState(null); // ID of the item currently being toggled

  // Function to fetch all items from the backend API
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/featured');
      const data = await res.json();
      if (res.ok && data.success) {
        // Filter out any potentially invalid items received from the API
        const validItems = Array.isArray(data.data) ? data.data.filter(
          i => i && i._id && i.type && typeof i.isFeatured === 'boolean'
        ) : [];
        if(Array.isArray(data.data) && validItems.length !== data.data.length) {
            console.warn("Filtered out invalid items during fetch:", data.data.length - validItems.length);
        }
        setItems(validItems); // Set valid items into state
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
    // console.log("Attempting to toggle item:", JSON.stringify(item, null, 2)); // Keep for debugging if needed

    // Double-check validation (though ItemCard should prevent invalid calls)
    if (item?._id == null || !item?.type || typeof item?.isFeatured !== 'boolean') {
        console.error("handleToggleFeatured: Received invalid item object:", item);
        setNotification({ message: 'Error: Cannot toggle, item data invalid.', type: 'error' });
        return;
    }

    // Prevent clicking multiple buttons quickly
    if (togglingId) return;
    setTogglingId(item._id); // Mark this item as being processed

    try {
      // Call the backend API to toggle the status
      const res = await fetch('/api/admin/featured/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item._id,
          type: item.type,
          currentFeaturedStatus: item.isFeatured,
        }),
      });
      const data = await res.json(); // Get the response

      if (res.ok && data.success) {
        // Update the item's status in the local state for immediate UI feedback
        setItems(prevItems =>
          prevItems.map(i =>
            i._id === item._id ? { ...i, isFeatured: data.data?.isFeatured ?? !i.isFeatured } : i
            // Use status from response if available, otherwise toggle current status
          )
        );
        // Show success message
        setNotification({ message: 'Status updated successfully!', type: 'success' });
      } else {
        // If the API call failed
        console.error("API Toggle Error Response:", data);
        throw new Error(data.error || 'Failed to toggle status.');
      }
    } catch (err) {
      // If fetch failed or threw an error
      console.error("Caught Error during toggle:", err);
      setNotification({ message: `Update failed: ${err.message}`, type: 'error' });
      // Important: Consider reverting the optimistic UI update here if needed
      // setItems(prevItems => prevItems.map(i => i._id === item._id ? item : i));
    } finally {
      setTogglingId(null); // Clear the processing flag
    }
  };

  // Separate items into videos and photos using useMemo for performance
  const videoItems = useMemo(() => items.filter(item => item.type === 'video'), [items]);
  const photoItems = useMemo(() => items.filter(item => item.type === 'photo'), [items]);

  // Function to render the main content area (loading, error, or items)
  const renderContent = () => {
    // Show loading spinner
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 size={40} className="animate-spin text-cyan-500" />
        </div>
      );
    }
    // Show error message
    if (error) {
      return (
         <div className="text-center p-8 bg-neutral-900/50 border border-red-700 rounded-lg">
           <AlertTriangle size={48} className="text-red-500 mb-4 mx-auto" />
           <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Items</h2>
           <p className="text-neutral-400">{error}</p>
         </div>
      );
    }
    // Show message if no items are found after loading
     if (items.length === 0) {
       return (
         <div className="text-center p-8 bg-neutral-900/50 border border-neutral-700 rounded-lg">
           <h2 className="text-2xl font-bold text-neutral-300 mb-2">No Items Found</h2>
           <p className="text-neutral-400">Upload videos or photos first using the admin panel.</p>
         </div>
       );
     }

    // Render the two-column layout for videos and photos
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10"> {/* Two columns on large screens */}

        {/* Video Column */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-neutral-300 border-b border-neutral-700 pb-2 flex items-center gap-2">
            <Video className="text-cyan-400" /> Videos
          </h2>
          {videoItems.length === 0 ? (
             <p className="text-neutral-500 italic">No videos found.</p>
          ) : (
             // Grid for items within the video column
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                 {videoItems.map(item => (
                   <ItemCard key={item._id} item={item} togglingId={togglingId} onToggle={handleToggleFeatured} />
                 ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Photo Column */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-neutral-300 border-b border-neutral-700 pb-2 flex items-center gap-2">
            <ImageIcon className="text-purple-400" /> Photos
          </h2>
          {photoItems.length === 0 ? (
             <p className="text-neutral-500 italic">No photos found.</p>
          ) : (
            // Grid for items within the photo column
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                  {photoItems.map(item => (
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
      {/* Container for notifications */}
       <AnimatePresence>
        {notification.message && (
          <Notification
            message={notification.message}
            type={notification.type}
            onDismiss={() => setNotification({ message: '', type: '' })}
          />
        )}
      </AnimatePresence>
      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 font-heading uppercase text-cyan-400">
        Manage Featured Work
      </h1>
      {/* Render loading state, error state, or the item grid */}
      {renderContent()}
    </div>
  );
}