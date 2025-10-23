"use client";
import React, { useState, useEffect } from 'react'; // Added useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, AlertTriangle, Play } from 'lucide-react'; // Added Loader2, AlertTriangle, Play
import Image from 'next/image'; // Use Next.js Image
import Link from 'next/link'; // Use Link for the button

const PortfolioSection = () => {
  const [items, setItems] = useState([]); // State for fetched items
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // No filtering needed here now, API provides only featured items

  useEffect(() => {
    const fetchFeaturedWork = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/featured-work');
        const data = await res.json();
        if (data.success) {
          setItems(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch featured work.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedWork();
  }, []); // Fetch on component mount

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={32} className="animate-spin text-cyan-500" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-neutral-900/50 border border-red-700 rounded-lg text-red-400">
           <AlertTriangle size={32} className="mx-auto mb-2" />
           Could not load featured work. {error}
        </div>
      );
    }
    if (items.length === 0) {
        return (
            <div className="text-center p-8 bg-neutral-900/50 border border-neutral-700 rounded-lg text-neutral-400">
                No featured work available at the moment.
            </div>
        );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <motion.div
            key={item._id}
            className="group relative overflow-hidden aspect-video bg-neutral-900 rounded-lg shadow-lg" // Added rounded-lg shadow-lg
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/portfolio" className="absolute inset-0 z-10" aria-label={`View ${item.title}`}>
                {/* Image component for thumbnail */}
                <Image
                    src={item.thumbnail || '/placeholder.jpg'} // Use placeholder
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                    unoptimized={item.thumbnail?.includes('cloudinary')} // Avoid double optimization
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <span className="text-xs text-cyan-400 font-body tracking-widest uppercase">
                        {/* Display category if available, otherwise 'Featured' */}
                        {item.category || 'Featured'}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-bold mt-1 text-white font-heading truncate">
                        {item.title}
                    </h3>
                </div>

                {/* Play Icon for Videos */}
                {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
                            <Play size={32} className="text-white fill-white" />
                        </div>
                    </div>
                )}
            </Link>
          </motion.div>
        ))}
      </div>
    );
  };


  return (
    <section className="py-20 md:py-32 bg-black text-white" id="work">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12 md:mb-16"> {/* Increased bottom margin */}
          <h2 className="section-title text-5xl md:text-7xl font-bold tracking-tight font-heading uppercase">Featured Work</h2>
          <p className="text-lg text-neutral-400 mt-4 max-w-2xl mx-auto font-body">A glimpse into stories we’ve brought to life.</p>
        </div>

        {/* Removed filter buttons */}

        {renderContent()} {/* Render dynamic content */}

        <div className="text-center mt-16">
          {/* Use Next.js Link for navigation */}
          <Link href="/portfolio" className="brutalist-button-secondary inline-flex items-center gap-2" data-magnetic>
            View Full Portfolio <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;