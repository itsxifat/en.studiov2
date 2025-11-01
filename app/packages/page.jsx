"use client";
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Video, Camera, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link'; // For Footer

// --- Reusable Header ---
const PackagesHeader = () => {
  const router = useRouter();
  return (
    <header className="relative overflow-hidden border-b border-neutral-800/50 bg-linear-to-b from-neutral-950 via-neutral-950 to-black pb-12 pt-20">
      <div className="absolute inset-0 bg-grid-neutral-700/[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />
      
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
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 font-heading"
        >
          <span className="text-transparent bg-clip-text bg-linear-to-r from-neutral-100 via-cyan-300 to-blue-400">
            Packages & Pricing
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto"
        >
          Transparent pricing for your creative needs.
        </motion.p>
      </div>
    </header>
  );
};

// --- Reusable Table Row ---
const PackageRow = ({ pkg, isHeader = false }) => {
  const cellClass = "px-4 py-3 sm:px-6 sm:py-4 text-left";
  const textClass = isHeader ? "text-sm font-semibold text-neutral-400 uppercase tracking-wider" : "text-base text-neutral-200 font-light";

  return (
    <div className={`flex w-full ${!isHeader ? 'border-b border-neutral-800' : ''} ${isHeader ? 'border-b-2 border-neutral-700' : ''}`}>
      <div className={`w-1/4 ${cellClass} ${!isHeader ? 'font-semibold text-white' : ''} ${textClass}`}>
        {pkg.packageName}
      </div>
      <div className={`w-1/4 ${cellClass} ${textClass}`}>
        {pkg.description}
      </div>
      <div className={`w-1/4 ${cellClass} ${textClass} text-right`}>
        {pkg.unitPrice}
      </div>
      <div className={`w-1/4 ${cellClass} ${textClass} text-right ${!isHeader ? 'font-semibold text-cyan-400' : ''}`}>
        {pkg.totalPrice}
      </div>
    </div>
  );
};

// --- Main Page Client Component ---
function PackagesPageClient() {
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || 'Reel'; // Get 'type' from URL
  
  const [activeTab, setActiveTab] = useState(defaultType);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all packages
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        if (res.ok && data.success) {
          setPackages(data.data);
        } else {
          throw new Error(data.error || 'Failed to load packages');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Memoized filtering for performance
  const reelPackages = useMemo(() => packages.filter(p => p.serviceType === 'Reel'), [packages]);
  const photoPackages = useMemo(() => packages.filter(p => p.serviceType === 'Photography'), [packages]);
  
  const currentPackages = activeTab === 'Reel' ? reelPackages : photoPackages;
  const currentNotes = activeTab === 'Reel'
    ? "Duration: max 40 sec || No model included || Extra charges may apply for critical needs or custom set design."
    : "Product photography with creative direction, standard editing & basic setup.";

  // Render the table, skeleton, or error states
  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="w-full h-64 flex justify-center items-center">
          <Loader2 className="animate-spin text-cyan-500" size={32} />
        </div>
      );
    }
    if (error) {
       return (
        <div className="w-full h-64 flex flex-col justify-center items-center text-red-400 bg-neutral-900/50 border border-red-700 rounded-lg">
           <AlertTriangle className="mb-2" /> Error loading packages.
        </div>
       );
    }
    
    return (
       <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} // This key change triggers the animation
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
                <div className="mb-4 text-neutral-400 italic text-sm text-center md:text-left">{currentNotes}</div>
                <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                    {/* Table Header */}
                    <PackageRow 
                        pkg={{ 
                            packageName: activeTab === 'Reel' ? 'Package' : 'Package',
                            description: activeTab === 'Reel' ? 'QTY' : 'Product QTY',
                            unitPrice: 'Unit Price', 
                            totalPrice: 'Total' 
                        }} 
                        isHeader={true} 
                    />
                    {/* Table Body */}
                    {currentPackages.length > 0 ? (
                        currentPackages.map(pkg => <PackageRow key={pkg._id} pkg={pkg} />)
                    ) : (
                        <div className="p-6 text-center text-neutral-500">No packages found for this service.</div>
                    )}
                </div>
            </motion.div>
       </AnimatePresence>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <PackagesHeader />
      
      <section className="container mx-auto px-8 py-16 max-w-6xl">
        {/* Tab Buttons */}
        <div className="flex justify-center mb-10">
            <div className="flex space-x-2 p-1.5 rounded-xl bg-neutral-900 border border-neutral-700/50">
              {/* Tab for Reels */}
              <button
                onClick={() => setActiveTab('Reel')}
                className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors
                  ${activeTab === 'Reel' ? 'text-black' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'}
                `}
              >
                {activeTab === 'Reel' && (
                  <motion.div
                    layoutId="active-package-pill"
                    className="absolute inset-0 z-0 rounded-lg bg-cyan-400"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10"><Video size={16} /></span>
                <span className="relative z-10">Dynamic Content (Reels)</span>
              </button>
              
              {/* Tab for Photography */}
              <button
                onClick={() => setActiveTab('Photography')}
                className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors
                  ${activeTab === 'Photography' ? 'text-black' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'}
                `}
              >
                {activeTab === 'Photography' && (
                  <motion.div
                    layoutId="active-package-pill"
                    className="absolute inset-0 z-0 rounded-lg bg-cyan-400"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10"><Camera size={16} /></span>
                <span className="relative z-10">Product Photography</span>
              </button>
            </div>
        </div>

        {/* Dynamic Table Content */}
        {renderTable()}

        {/* Notes Section (from PDF) */}
        <div className="max-w-4xl mx-auto mt-12 text-sm text-neutral-500 border-t border-neutral-800 pt-8">
          <h4 className="font-semibold text-neutral-300 mb-3 text-base">Please Note:</h4>
          <ul className="list-decimal list-outside pl-5 space-y-2 font-body">
            <li>Full shoot will be managed and executed by Enfinito Studio.</li>
            <li>No model is included with any package. However, Enfinito Studio can assist in arranging models if needed. Model remuneration will be charged separately.</li>
            <li>Outdoor shoots will incur additional charges, including logistics and setup costs.</li>
            <li>Raw files will not be provided unless requested in advance (additional charges may apply).</li>
            <li>Final delivery will include edited high-resolution images in JPEG format.</li>
            <li>Client must confirm product delivery to the studio at least 2 days prior to the scheduled shoot.</li>
            <li>Revisions will be limited to one round of edits per product; extra revisions will be charged.</li>
            <li>Product return logistics (if required) are the client’s responsibility unless otherwise discussed.</li>
            <li>Customized set design or props beyond the standard setup will require extra charges.</li>
            <li>Project timeline, delivery, and final pricing may vary depending on custom requirements.</li>
          </ul>
        </div>
      </section>

      {/* Compact Footer */}
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

// Use Suspense to handle the client-side useSearchParams
export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500" size={40} /></div>}>
      <PackagesPageClient />
    </Suspense>
  );
}