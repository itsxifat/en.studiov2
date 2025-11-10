"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Video, Camera, MonitorPlay, MousePointerClick, Send } from 'lucide-react';

// Animation variants for staggered reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// --- Page Header Component ---
const AboutHeader = () => {
  const router = useRouter();
  return (
    <header className="relative overflow-hidden border-b border-neutral-800/50 bg-black pt-20 pb-12">
      {/* Subtle background textures */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-neutral-900/[0.2]" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 211, 238, 0.1), rgba(255, 255, 255, 0))'
          }}
        />
      </div>
      
      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-4 sm:top-8 sm:left-8 z-20 inline-flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md p-2.5 text-neutral-300 border border-neutral-700/50 transition-all 
                   hover:bg-neutral-800/80 hover:text-white 
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53A4DB]"
        aria-label="Go back"
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </motion.button>

      {/* Header Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-base font-semibold text-[#53A4DB] uppercase tracking-wider"
        >
          Our Story
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 font-heading uppercase"
        >
          Behind The Lens
        </motion.h1>
      </div>
    </header>
  );
};

// --- Main Page Component ---
export default function AboutPage() {
  return (
    <main className="min-h-svh bg-black text-white">
      <AboutHeader />

      {/* --- Our Story Section --- */}
      <motion.section 
        className="container mx-auto px-4 sm:px-8 py-16 md:py-24 max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800">
              <Image 
                src="https://res.cloudinary.com/dagmsvwui/image/upload/v1762237631/IMG_20251104_122245_zxgph7.png"
                alt="En.Studio team at work"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
              Our Vision
            </h2>
            <div className="space-y-4 text-neutral-300 font-body text-lg">
              <p>
                <strong>En.Studio</strong> is a proud sister concern of <span className="text-[#53A4DB] font-semibold">Enfinito</span>, 
                born from a shared passion for cinematic storytelling and visual excellence. 
                We believe that every brand has a unique story to tell, and our mission is to tell it beautifully.
              </p>
              <p>
                We are a full-service production house specializing in professional videography and photography. 
                Our team is dedicated to providing the absolute best service, translating your vision into 
                compelling content that captivates and converts.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Our Expertise Section --- */}
      <motion.section 
        className="py-16 md:py-24 bg-black border-y border-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl font-bold font-heading text-center mb-12"
          >
            Core Expertise
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Videography Card */}
            <ExpertiseCard 
              icon={<Video size={28} className="text-[#53A4DB]" />}
              title="Professional Videography"
              description="Full-scale video production, from concept to final cut, for films, events, and brand stories."
            />
            {/* Photography Card */}
            <ExpertiseCard 
              icon={<Camera size={28} className="text-[#53A4DB]" />}
              title="Commercial Photography"
              description="High-end product, lifestyle, and corporate photography that elevates your brand image."
            />
            {/* TVC Card */}
            <ExpertiseCard 
              icon={<MonitorPlay size={28} className="text-[#53A4DB]" />}
              title="TVC Production"
              description="Broadcast-quality Television Commercials designed for maximum impact and reach."
            />
            {/* OVC Card */}
            <ExpertiseCard 
              icon={<MousePointerClick size={28} className="text-[#53A4DB" />}
              title="OVC & Digital Content"
              description="Engaging Online Video Commercials (OVC) and social content tailored for the digital age."
            />
          </div>
        </div>
      </motion.section>

      {/* --- Flexible Shoots Section --- */}
      <motion.section 
        className="container mx-auto px-4 sm:px-8 py-16 md:py-24 max-w-5xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          variants={itemVariants} 
          className="text-3xl md:text-4xl font-bold font-heading text-center mb-12"
        >
          Flexible Production
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Without Model */}
          <motion.div variants={itemVariants} className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-3">Studio & Product</h3>
            <p className="text-neutral-300 font-body">
              We excel at product videography and photography, shooting items with precision and creative flair, <span className="font-semibold text-white">without a model</span>. 
              Our studio is equipped to make your products the star.
            </p>
          </motion.div>
          {/* With Model */}
          <motion.div variants={itemVariants} className="bg-black border border-neutral-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-3">Lifestyle & Narrative</h3>
            <p className="text-neutral-300 font-body">
              For lifestyle campaigns, TVCs, and narrative work, we provide full-service production, 
              including casting and managing professional <span className="font-semibold text-white">models</span> to bring your story to life.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Call to Action Section --- */}
      <section className="py-16 md:py-24 bg-black border-t border-black">
        <motion.div 
          className="container mx-auto px-4 sm:px-8 max-w-4xl text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">
            Ready to tell your story?
          </h2>
          <p className="text-lg text-neutral-300 mt-4 mb-8 max-w-2xl mx-auto">
            Let's discuss your vision. Contact us for a custom proposal or to get started with one of our packages.
          </p>
          <Link
            href="/quote"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 h-12
                       bg-white text-black font-semibold rounded-lg
                       transition-colors duration-300 ease-out
                       hover:bg-neutral-200
                       active:scale-95
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white 
                       focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="relative z-10">Get a Quote</span>
            <Send size={16} />
          </Link>
        </motion.div>
      </section>

    </main>
  );
}

// Reusable card for the "Expertise" section
const ExpertiseCard = ({ icon, title, description }) => (
  <motion.div 
    variants={itemVariants}
    className="border border-black bg-neutral-800 p-6 rounded-lg"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2 font-heading">{title}</h3>
    <p className="text-neutral-400 font-body text-sm">{description}</p>
  </motion.div>
);