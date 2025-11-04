"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 as Loader, AlertTriangle, ArrowLeft, Video, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
// Import YouTubeEmbed and PhotoModal from the shared client components
import { YouTubeEmbed, Modal as PhotoModal } from '../../_clientComponents'; 

// --- Masonry Grid Component ---
const MasonryGrid = ({ photos, onImageClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <motion.div
          key={photo._id}
          className="cursor-pointer overflow-hidden rounded-lg border border-neutral-800/60"
          onClick={() => onImageClick(photo)}
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
            className="w-full h-auto" // Key for masonry
            unoptimized={photo.imageUrl.includes('cloudinary')}
          />
        </motion.div>
      ))}
    </div>
  );
};

// --- ✨ UPDATED: Behind the Scenes Component ✨ ---
const BehindTheScenes = ({ btsItems }) => {
  // If no items, don't render the section
  if (!btsItems || btsItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-neutral-900 border-y border-neutral-800">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12">
          Behind The Scenes
        </h2>
        {/* Render a grid of all BTS items */}
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
    <header className="relative overflow-hidden border-b border-neutral-800/50 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black pb-12 pt-20">
      <div className="absolute inset-0 bg-grid-neutral-700/[0.03]" />
      <motion.button
        onClick={() => router.back()}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-4 sm:top-8 sm:left-8 z-20 inline-flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md p-2.5 text-neutral-300 border border-neutral-700/50 transition-all hover:bg-neutral-800/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
  const [btsItems, setBtsItems] = useState([]); // ✨ New state for BTS items
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
        setBtsItems(data.data.btsItems || []); // ✨ Set BTS items state
      } catch (err) {
        console.error("Failed to fetch project data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [slug]);

  const openModal = (photo) => {
    setSelectedImage({
      highResUrl: photo.imageUrl,
      filename: photo.title || 'Project Photo'
    });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <main className="min-h-svh bg-black text-white flex justify-center items-center">
        <Loader2 size={40} className="animate-spin text-cyan-500" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-svh bg-black text-white flex justify-center items-center p-4">
         <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
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

      {/* Main Photo Gallery */}
      <section className="container mx-auto px-4 sm:px-8 py-16 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12">
          Project Gallery
        </h2>
        <MasonryGrid photos={photos} onImageClick={openModal} />
      </section>

      {/* ✨ Pass the btsItems array to the component */}
      <BehindTheScenes btsItems={btsItems} />
      
      {/* Footer */}
      <footer className="border-t border-neutral-800/50 mt-16 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} En.Studio · All Rights Reserved
          </p>
        </div>
      </footer>

      {/* Modal for viewing full images */}
      <AnimatePresence>
        {selectedImage && (
          <PhotoModal
            open={true} // Pass open prop
            item={{ thumbnail: selectedImage.highResUrl, title: selectedImage.filename }} // Pass item prop
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </main>
  );
}