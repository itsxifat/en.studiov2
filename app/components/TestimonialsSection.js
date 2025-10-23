"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  { quote: 'They transformed our concept into a visual masterpiece.', name: 'Jane Doe', project: 'Launch Film', photo: 'https://placehold.co/100x100' },
  { quote: 'Professional, creative, and delivered on time.', name: 'John Smith', project: 'Brand Story', photo: 'https://placehold.co/100x100' },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => { setCurrentIndex(prev => (prev + 1) % testimonials.length); }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 bg-neutral-900 text-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="section-title text-5xl md:text-7xl font-bold tracking-tight font-heading uppercase">Trusted By The Best</h2>
          <p className="text-lg text-neutral-400 mt-4 max-w-2xl mx-auto font-body">
            Our clients&apos; success is our success.
          </p>
        </div>
        <div className="relative max-w-3xl mx-auto h-64">
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <p className="text-xl md:text-2xl italic text-neutral-200 font-body">
                &quot;{testimonials[currentIndex].quote}&quot;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Image
                  src={testimonials[currentIndex].photo}
                  alt={testimonials[currentIndex].name}
                  width={56}
                  height={56}
                  className="w-14 h-14 border-2 border-neutral-700 object-cover"
                />
                <div>
                  <p className="font-bold text-lg text-white font-heading">{testimonials[currentIndex].name}</p>
                  <p className="text-neutral-400 font-body">{testimonials[currentIndex].project}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
