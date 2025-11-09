"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Animation for elements revealing on scroll
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const AboutSection = () => {
  return (
    <motion.section 
      className="py-20 md:py-32 bg-black border-y border-neutral-800"
      id="about" // Add an ID for potential nav linking
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% in view
      transition={{ staggerChildren: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image Column */}
          <motion.div variants={itemVariants}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 shadow-lg">
              <Image 
                src="https://res.cloudinary.com/dagmsvwui/image/upload/v1762237631/IMG_20251104_122245_zxgph7.png"
                alt="En.Studio team at work"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6 uppercase">
              Behind The Lens
            </h2>
            <div className="space-y-4 text-neutral-300 font-body text-lg">
              <p>
                <strong>En.Studio</strong> is a proud sister concern of <span className="text-cyan-400 font-semibold">Enfinito</span>, 
                born from a shared passion for cinematic storytelling and visual excellence. 
              </p>
              <p>
                We are a full-service production house specializing in professional videography and photography, 
                translating your vision into compelling content that captivates and converts.
              </p>
            </div>
            {/* Learn More Button */}
            <Link
              href="/about"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 h-12 mt-8
                         bg-neutral-800/50 text-neutral-200 font-semibold rounded-lg
                         border border-neutral-700/50
                         transition-all duration-300 ease-out
                         hover:bg-neutral-700/80 hover:text-white
                         active:scale-95
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600 
                         focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Learn More About Us
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;