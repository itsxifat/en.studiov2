"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch testimonials on mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/testimonials'); // Fetch from public API
        const data = await res.json();
        if (res.ok && data.success) {
          setTestimonials(data.data);
        } else {
          throw new Error(data.error || 'Failed to load testimonials');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (testimonials.length <= 1) return; // Don't auto-slide if only 0 or 1 testimonial
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 7000); // Increased interval to 7 seconds
    return () => clearInterval(interval);
  }, [testimonials.length]); // Re-run effect if number of testimonials changes

  // Navigation handlers
  const goToPrevious = () => {
     if (testimonials.length === 0) return;
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  const goToNext = () => {
     if (testimonials.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  // Content rendering based on state
  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-cyan-500" size={32} /></div>;
    }
    if (error) {
       return <div className="text-red-400 text-center flex flex-col items-center h-64 justify-center"><AlertTriangle className="mb-2" /> Error loading testimonials.</div>;
    }
     if (testimonials.length === 0) {
        return <div className="text-neutral-500 text-center h-64 flex items-center justify-center">No testimonials available yet.</div>;
    }

    // Current testimonial data
    const currentTestimonial = testimonials[currentIndex];
    
    // Check if currentTestimonial is valid before rendering
    if (!currentTestimonial) {
        return <div className="text-neutral-500 text-center h-64 flex items-center justify-center">Loading testimonial...</div>;
    }

    return (
        <div className="relative max-w-3xl mx-auto min-h-64 md:min-h-72 flex items-center justify-center">
            {/* Previous Button */}
            {testimonials.length > 1 && (
                <button
                    onClick={goToPrevious}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-neutral-800/50 hover:bg-neutral-700/70 text-white transition -ml-4 md:-ml-10
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-white 
                               focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* Testimonial Content with Animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex} // Key change triggers animation
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full px-8 md:px-0" // Add padding on mobile
                >
                    <blockquote className="text-center">
                        <p className="text-xl md:text-2xl italic text-neutral-200 font-body mb-6">
                            &quot;{currentTestimonial.quote}&quot;
                        </p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center justify-center gap-4">
                        <div className="shrink-0 w-14 h-14 rounded-full bg-neutral-700 border-2 border-neutral-600 overflow-hidden">
                            {currentTestimonial.photo ? (
                                <Image
                                    src={currentTestimonial.photo}
                                    alt={currentTestimonial.name}
                                    width={56}
                                    height={56}
                                    className="object-cover w-full h-full"
                                    unoptimized // Assuming photo is from Cloudinary
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">No Photo</div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-white font-heading">{currentTestimonial.name}</p>
                            {currentTestimonial.project && (
                                <p className="text-sm text-neutral-400 font-body">{currentTestimonial.project}</p>
                            )}
                        </div>
                    </figcaption>
                </motion.div>
            </AnimatePresence>

             {/* Next Button */}
             {testimonials.length > 1 && (
                 <button
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-neutral-800/50 hover:bg-neutral-700/70 text-white transition -mr-4 md:-mr-10
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-white 
                               focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label="Next testimonial"
                 >
                    <ChevronRight size={24} />
                 </button>
            )}
        </div>
    );
  };


  return (
    // ✨ FIX: Changed bg-neutral-900 to bg-black and updated id
    <section className="py-20 md:py-32 bg-black text-white overflow-hidden" id="testimonials">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight font-heading uppercase">Trusted By The Best</h2>
          <p className="text-md sm:text-lg text-neutral-400 mt-4 max-w-2xl mx-auto font-body">
            Our clients&apos; success stories speak volumes.
          </p>
        </div>
        {renderContent()} {/* Render dynamic content */}
      </div>
    </section>
  );
};

export default TestimonialsSection;