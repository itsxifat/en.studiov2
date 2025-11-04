"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, ArrowLeft, Send } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// --- Reusable Header ---
const PackagesHeader = ({ title, description }) => {
  const router = useRouter();
  return (
    <header className="relative overflow-hidden border-b border-neutral-800/50 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black pb-12 pt-20">
      <div className="absolute inset-0 bg-grid-neutral-700/[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />
      
      <motion.button
        onClick={() => router.back()}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-4 sm:top-8 sm:left-8 z-20 inline-flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md p-2.5 text-neutral-300 border border-neutral-700/50 transition-all hover:bg-neutral-800/80 hover:text-white 
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black" // Professional focus
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-cyan-300 to-blue-400">
            {title || 'Packages & Pricing'}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto"
        >
          {description || 'Transparent pricing for your creative needs.'}
        </motion.p>
      </div>
    </header>
  );
};

// --- ✨ NEW: Mobile Card Component (Improved Design) ✨ ---
const PackageCard = ({ pkg }) => {
  return (
    <div className="border border-neutral-800 rounded-lg bg-neutral-900/50 p-5 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white font-heading">{pkg.packageName}</h3>
        <span className="text-lg font-semibold text-cyan-400 flex-shrink-0 ml-4">{pkg.totalPrice}</span>
      </div>
      
      {pkg.description && (
        <p className="text-sm text-neutral-400 italic mb-5">{pkg.description}</p>
      )}

      <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Quantity</p>
          <p className="text-base text-neutral-200 font-medium">{pkg.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Unit Price</p>
          <p className="text-base text-neutral-200 font-medium">{pkg.unitPrice}</p>
        </div>
      </div>
    </div>
  );
};


// --- Desktop Table Row Component ---
const PackageRow = ({ pkg, isHeader = false }) => {
  const cellClass = "px-4 py-3 sm:px-6 sm:py-4 text-left";
  const textClass = isHeader ? "text-sm font-semibold text-neutral-400 uppercase tracking-wider" : "text-base text-neutral-200 font-light";

  return (
    <div className={`hidden sm:flex w-full ${!isHeader ? 'border-b border-neutral-800' : 'border-b-2 border-neutral-700'} last:border-b-0`}>
      <div className={`w-1/5 ${cellClass} ${!isHeader ? 'font-semibold text-white' : ''} ${textClass}`}>
        {pkg.packageName}
      </div>
      <div className={`w-2/5 ${cellClass} ${textClass}`}>
        {pkg.description}
      </div>
      <div className={`w-1/5 ${cellClass} ${textClass}`}>
        {pkg.quantity}
      </div>
      <div className={`w-1/5 ${cellClass} ${textClass} text-right`}>
        {pkg.unitPrice}
      </div>
      <div className={`w-1/5 ${cellClass} ${textClass} text-right ${!isHeader ? 'font-semibold text-cyan-400' : ''}`}>
        {pkg.totalPrice}
      </div>
    </div>
  );
};

// --- Main Page Client Component ---
function PackagesPageClient() {
  const params = useParams();
  const serviceId = params.serviceId;

  const [service, setService] = useState(null);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceId) {
        setIsLoading(false);
        setError("No service ID provided.");
        return;
    };

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/packages/${serviceId}`);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to load data: ${res.status} ${res.statusText}. Server says: ${errorText}`);
        }
        
        const data = await res.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to parse data.');
        }

        if (data.data) {
            setService(data.data.service);
            setPackages(data.data.packages || []);
        } else {
            throw new Error("Invalid data structure from API.");
        }

      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [serviceId]);

  // Render the table, skeleton, or error states
  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="w-full min-h-[30vh] flex justify-center items-center">
          <Loader2 className="animate-spin text-cyan-500" size={32} />
        </div>
      );
    }
    if (error) {
       return (
        <div className="w-full min-h-[30vh] flex flex-col justify-center items-center text-red-400 bg-neutral-900/50 border border-red-700 rounded-lg p-8">
           <AlertTriangle className="mb-4 h-8 w-8" />
           <h3 className="text-xl font-semibold mb-2">Error Loading Packages</h3>
           <p className="text-neutral-400 text-sm max-w-md text-center">{error}</p>
        </div>
       );
    }
    
    const notes = service?.title?.includes("Reel")
      ? "Duration: max 40 sec || No model included || Extra charges may apply for critical needs or custom set design."
      : "Product photography with creative direction, standard editing & basic setup.";

    return (
       <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
                <div className="mb-4 text-neutral-400 italic text-sm text-center md:text-left">{notes}</div>
                
                {/* --- Desktop Table (Hidden on Mobile) --- */}
                <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50 hidden sm:block">
                    {/* ✨ STICKY Table Header ✨ */}
                    <div className="sticky top-0 bg-neutral-900 z-10">
                        <PackageRow 
                            pkg={{ 
                                packageName: 'Package',
                                description: 'Description',
                                quantity: 'QTY',
                                unitPrice: 'Unit Price', 
                                totalPrice: 'Total' 
                            }} 
                            isHeader={true} 
                        />
                    </div>
                    {(packages || []).length > 0 ? (
                        packages.map(pkg => <PackageRow key={pkg._id} pkg={pkg} />)
                    ) : (
                        <div className="p-6 text-center text-neutral-500">No packages found for this service.</div>
                    )}
                </div>

                {/* --- Mobile Card List (Hidden on Desktop) --- */}
                <div className="block sm:hidden space-y-4">
                  {(packages || []).length > 0 ? (
                      packages.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)
                  ) : (
                      <div className="p-6 text-center text-neutral-500 border border-neutral-800 rounded-lg bg-neutral-900/50">
                        No packages found for this service.
                      </div>
                  )}
                </div>

            </motion.div>
       </AnimatePresence>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <PackagesHeader title={service?.title} description={service?.description} />
      
      <section className="container mx-auto px-4 sm:px-8 py-12 sm:py-16 max-w-6xl">
        {renderTable()}
        
        {/* --- ✨ NEW: Call-to-Action (CTA) Block ✨ --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }} // Fades in after table
          className="mt-16 p-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-neutral-800 rounded-lg 
                     flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-2xl font-bold font-heading text-white">Ready to start your project?</h3>
            <p className="text-neutral-300 mt-1 max-w-lg">
              Let&apos;s discuss your vision. Contact us for a custom proposal or to get started with one of these packages.
            </p>
          </div>
          <Link
            href="/quote" // Links to your quote page
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 h-12
                       bg-white text-black font-semibold rounded-lg
                       transition-colors duration-300 ease-out
                       hover:bg-neutral-200
                       active:scale-95
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white 
                       focus-visible:ring-offset-2 focus-visible:ring-offset-black
                       flex-shrink-0" // Prevents button from shrinking
          >
            <span className="relative z-10">Get a Quote</span>
            <Send size={16} />
          </Link>
        </motion.div>

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

// Suspense Fallback
export default function PackagesPage() {
  return (
    <Suspense fallback={
      <div className="bg-black min-h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
      </div>
    }>
      <PackagesPageClient />
    </Suspense>
  );
}