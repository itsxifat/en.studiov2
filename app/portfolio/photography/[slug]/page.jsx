"use client";
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2 as Loader, 
  AlertTriangle, 
  ArrowLeft, 
  Video, 
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { YouTubeEmbed } from '../../_clientComponents'; 

// --- ✨ 1. Import the new Lightbox library ---
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// --- ✨ 2. NEW: Professional Image Carousel Lightbox ---
const ImageCarouselModal = ({ photos, index, onClose }) => {
  // Create a 'slides' array for the lightbox
  const slides = photos.map(photo => ({
    src: photo.imageUrl,
    width: photo.width,
    height: photo.height,
  }));

  return (
    <Lightbox
      open={index >= 0}
      index={index}
      close={onClose}
      slides={slides}
      // Enable the zoom plugin
      plugins={[Zoom]}
      // Performance and UI optimizations
      animation={{ fade: 300, swipe: 500 }}
      carousel={{
        padding: "0px",
        imageFit: "contain",
      }}
      styles={{
        container: { backgroundColor: "rgba(5, 5, 10, 0.92)" },
        icon: { color: "#fff", filter: "drop-shadow(0 0 5px rgba(0,0,0,0.8))" },
      }}
      // Use Lucide icons for a consistent look
      render={{
        iconPrev: () => <ChevronLeft size={24} />,
        iconNext: () => <ChevronRight size={24} />,
        iconClose: () => <X size={22} strokeWidth={2.5} />,
        iconZoomIn: () => null, // Hide default zoom icons
        iconZoomOut: () => null,
      }}
    />
  );
};


// --- Masonry Grid Component ---
const MasonryGrid = ({ photos, onImageClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo, index) => ( // ✨ Pass index to onImageClick
        <motion.div
          key={photo._id}
          className="cursor-pointer overflow-hidden rounded-lg border border-neutral-800/60"
          onClick={() => onImageClick(index)} // ✨ Pass index
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
        >
          <Image
            src={photo.imageUrl}
            alt={photo.title || 'Portfolio photo'}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            // ✨ FIX: Removed className="w-full h-auto"
            // This will force next/image to respect the aspect ratio
            // within the bounds of the grid column.
            unoptimized={photo.imageUrl.includes('cloudinary')}
          />
        </motion.div>
      ))}
    </div>
  );
};

// --- Behind the Scenes Component ---
const BehindTheScenes = ({ btsItems }) => {
  if (!btsItems || btsItems.length === 0) {
    return null;
  }
  return (
    <section className="py-16 md:py-24 bg-neutral-900 border-y border-neutral-800">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12">
          Behind The Scenes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {btsItems.map(item => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-700 mb-4">
                {item.type === 'video' ? (
                  <YouTubeEmbed youtubeId={item.url} title="Behind the Scenes" />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.description || 'Behind the scenes'}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="50vw"
                    unoptimized={item.url.includes('cloudinary')}
                  />
                )}
              </div>
              {item.description && (
                <p className="text-neutral-300 font-body text-sm md:text-base text-center italic">
                  {item.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Project Header Component ---
const ProjectHeader = ({ project }) => {
  const router = useRouter();
  return (
    // ✨ FIX: Typo bg-linear-to-b -> bg-gradient-to-b
    <header className="relative overflow-hidden border-b border-neutral-800/50 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black pb-12 pt-20">
      <div className="absolute inset-0 bg-grid-neutral-700/[0.03]" />
      <motion.button
        onClick={() => router.back()}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-4 sm:top-8 sm:left-8 z-20 inline-flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md p-2.5 text-neutral-300 border border-neutral-700/50 transition-all 
                   hover:bg-neutral-800/80 hover:text-white 
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500" // Cleaned focus
        aria-label="Go back"
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </motion.button>
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 font-heading"
        >
          {project.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto"
        >
          {project.description}
        </motion.p>
      </div>
    </header>
  );
};

// --- Main Page Component ---
export default function PhotographyProjectPage() {
  const params = useParams();
  const { slug } = params;

  const [project, setProject] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [btsItems, setBtsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1); // ✨ Use -1 to signify "closed"

  useEffect(() => {
    if (!slug) return;

    const fetchProjectData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/photo-projects/${slug}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch project data.');
        }
        setProject(data.data.project);
        setPhotos(data.data.photos || []);
        setBtsItems(data.data.btsItems || []);
      } catch (err) {
        console.error("Failed to fetch project data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [slug]);

  // ✨ Updated to open modal with the clicked image's index
  const openModal = (index) => {
    setLightboxIndex(index);
  };

  const closeModal = () => {
    setLightboxIndex(-1);
  };

  if (isLoading) {
    return (
      <main className="min-h-svh bg-black text-white flex justify-center items-center">
        <Loader size={40} className="animate-spin text-[#53A4DB]" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-svh bg-black text-white flex justify-center items-center p-4">
         <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          // ✨ FIX: Typo bg-linear-to-br -> bg-gradient-to-br
          className="rounded-xl border border-red-800/50 bg-gradient-to-br from-red-900/20 to-neutral-950/40 p-12 py-16 text-center"
        >
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-5" aria-hidden="true" />
          <h2 className="text-2xl font-bold font-heading text-red-300 mb-2">Error Loading Project</h2>
          <p className="mt-2 text-base text-neutral-400">{error}</p>
        </motion.div>
      </main>
    );
  }
  
  if (!project) return null;

  return (
    <main className="min-h-svh bg-black text-white">
      <ProjectHeader project={project} />

      <section className="container mx-auto px-4 sm:px-8 py-16 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12">
          Project Gallery
        </h2>
        <MasonryGrid photos={photos} onImageClick={openModal} />
      </section>

      <BehindTheScenes btsItems={btsItems} />
      
      <footer className="border-t border-neutral-800/50 mt-16 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} En.Studio · All Rights Reserved
          </p>
        </div>
      </footer>

      {/* --- ✨ Use the new ImageCarouselModal ✨ --- */}
      <ImageCarouselModal
        photos={photos}
        index={lightboxIndex}
        onClose={closeModal}
      />
    </main>
  );
}