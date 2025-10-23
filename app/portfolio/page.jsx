"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Video, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ClientPortfolioPage } from './_clientComponents';
import { PhotographyGallery } from './_photographyGallery'; // New Component

// Your existing PortfolioHeader (Unchanged)
const PortfolioHeader = () => {
  const router = useRouter();

  return (
    <header className="relative overflow-hidden border-b border-neutral-800/50 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-neutral-700/[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />

      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 inline-flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-md p-2.5 text-neutral-300 border border-neutral-700/50 transition-all hover:bg-neutral-800/80 hover:text-white hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg"
        aria-label="Go back to previous page"
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </motion.button>

      {/* Compact Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center py-12 sm:py-16">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Image
            src="/logo.png"
            alt="En.Studio Logo"
            width={80}
            height={80}
            className="h-16 w-auto sm:h-20 drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Title & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 font-heading">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-cyan-300 to-blue-400">
              Studio Portfolio
            </span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
            Crafting digital excellence through innovative design and development
          </p>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" aria-hidden="true" />
    </header>
  );
};

// NEW: Tab Selector Component
const PortfolioTabSelector = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'video', label: 'Video Production', icon: Video },
    { id: 'photography', label: 'Photography', icon: Camera },
  ];

  return (
    <nav className="flex justify-center p-4 border-b border-neutral-800/50 bg-black/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex space-x-3 p-1.5 rounded-xl bg-neutral-900/70 border border-neutral-700/50">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex-shrink-0 whitespace-nowrap rounded-lg px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold tracking-wide transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500/80 focus:ring-offset-2 focus:ring-offset-black/90 flex items-center gap-2.5 ${
              activeTab === tab.id
                ? "text-white shadow-lg shadow-cyan-500/30"
                : "text-neutral-400 hover:text-neutral-100"
            }`}
            aria-pressed={activeTab === tab.id}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-portfolio-pill"
                className="absolute inset-0 z-0 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10"><tab.icon size={16} /></span>
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

// NEW: Wrapper for your original Video/Web portfolio content
const VideoPortfolio = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        let fetchedItems = [];
        if (data?.success && Array.isArray(data.data)) {
          fetchedItems = data.data;
        } else if (Array.isArray(data)) {
          fetchedItems = data;
        } else {
          console.error("API did not return expected format:", data);
          fetchedItems = [];
        }
        
        setItems(fetchedItems);
        const derivedCategories = [
          ...new Set(fetchedItems.map(item => item.category).filter(c => typeof c === 'string' && c.trim() !== ''))
        ].sort((a, b) => a.localeCompare(b));
        setCategories(derivedCategories);

      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
        setItems([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  return (
    <ClientPortfolioPage
      items={items}
      categories={categories}
      isLoading={isLoading}
    />
  );
}


// UPDATED: Main Page Component
export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('video'); // 'video' or 'photography'

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <PortfolioHeader />

      <PortfolioTabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Conditional Content Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'video' ? (
            <VideoPortfolio />
          ) : (
            <PhotographyGallery />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Compact Footer (Unchanged) */}
      <footer className="border-t border-neutral-800/50 mt-16 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} En.Studio · All Rights Reserved
          </p>
        </div>
      </footer>
    </main>
  );
}