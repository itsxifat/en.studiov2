"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 as Loader, AlertTriangle, X, Maximize2 } from "lucide-react";
import Image from "next/image"; // Using Next.js Image for optimization

// NEW: Simple Photo Modal
const PhotoModal = ({ imageUrl, alt, onClose }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      key="photo-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-xl"
      style={{ backgroundColor: "rgba(5, 5, 10, 0.92)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged photo view"
    >
      {/* Close Button */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9, rotate: 0 }}
        className="absolute right-3 top-3 sm:right-5 sm:top-5 z-30 rounded-full bg-black/70 backdrop-blur-sm p-2.5 text-neutral-300 border border-neutral-700/50 transition-colors hover:bg-red-600/80 hover:text-white hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg"
        aria-label="Close modal"
      >
        <X size={22} strokeWidth={2.5} />
      </motion.button>
      
      {/* Image Container */}
      <motion.div
        key={imageUrl}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
        className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking image
      >
        <Image
          src={imageUrl}
          alt={alt || "Enlarged portfolio photo"}
          width={1920}
          height={1080}
          className="object-contain w-auto h-auto max-w-full max-h-full rounded-lg shadow-2xl"
          priority
        />
      </motion.div>
    </motion.div>
  );
};


// NEW: Main Photography Gallery Component
export function PhotographyGallery() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For the modal

  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to fetch photos.');
        }

        setPhotos(data.photos || []);
      } catch (err) {
        console.error("Failed to fetch photos:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const openModal = (photo) => {
    setSelectedImage(photo);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center py-20">
          <Loader size={40} className="animate-spin text-cyan-500 mb-4" aria-label="Loading photos" />
          <p className="text-lg text-neutral-400 font-medium">Loading Photo Gallery...</p>
          <p className="text-sm text-neutral-500 mt-2">Fetching memories from the studio</p>
        </div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 rounded-xl border border-red-800/50 bg-gradient-to-br from-red-900/20 to-neutral-950/40 p-12 py-16 text-center"
        >
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-5" aria-hidden="true" />
          <h2 className="text-2xl font-bold font-heading text-red-300 mb-2">Error Loading Photos</h2>
          <p className="mt-2 text-base text-neutral-400">
            {error}
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Please ensure the server credentials and album ID are correct.
          </p>
        </motion.div>
      );
    }

    if (photos.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900/40 to-neutral-950/40 p-12 py-16 text-center"
        >
          <Camera className="mx-auto h-16 w-16 text-neutral-600 mb-5" aria-hidden="true" />
          <h2 className="text-2xl font-bold font-heading text-neutral-200 mb-2">No Photos Found</h2>
          <p className="mt-2 text-base text-neutral-400">This album appears to be empty or could not be loaded.</p>
        </motion.div>
      );
    }

    // Render the photo grid
    return (
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5"
      >
        <AnimatePresence>
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-900 shadow-lg"
              onClick={() => openModal(photo)}
            >
              <Image
                src={photo.thumbnailUrl}
                alt={photo.filename || 'Portfolio photo'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover h-full w-full transition-all duration-500 ease-in-out group-hover:scale-110"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzNzQwNWQiLz48L3N2Zz4=" // Dark gray blur
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
                <Maximize2 size={32} className="text-white drop-shadow-lg" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 min-h-[60vh]">
        {renderContent()}
      </section>

      <AnimatePresence>
        {selectedImage && (
          <PhotoModal
            imageUrl={selectedImage.highResUrl}
            alt={selectedImage.filename}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}