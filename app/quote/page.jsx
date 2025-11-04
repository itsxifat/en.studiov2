"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, AlertTriangle, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for the back button

// --- Reusable Button Components (Styles Swapped) ---

// PRIMARY Button: WhatsApp (Highlighted)
const WhatsAppButton = ({ label, number }) => {
  if (!number) return null;
  const href = `https://wa.me/${number}`;
  
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 w-full sm:w-auto
                 bg-white text-black font-semibold rounded-lg
                 transition-colors duration-300 ease-out
                 hover:bg-neutral-200
                 active:scale-95
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white 
                 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      aria-label={label}
    >
      <MessageSquare size={18} />
      <span className="relative z-10">{label}</span>
    </Link>
  );
};

// SECONDARY Button: Email Form Submit
const EmailSubmitButton = ({ label, isLoading }) => {
  return (
    <button 
      type="submit"
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 w-full sm:w-auto
                 bg-neutral-800/50 text-neutral-300 font-semibold rounded-lg
                 border border-neutral-700/50
                 transition-all duration-300 ease-out
                 hover:bg-neutral-700/80 hover:text-white
                 active:scale-95
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600 
                 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
      aria-label={label}
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <>
          <Send size={16} />
          <span className="relative z-10">{label}</span>
        </>
      )}
    </button>
  );
};

// Form Status Message
const FormMessage = ({ status, message }) => {
  if (!status) return null;
  const style = {
    success: 'bg-green-800/50 border-green-700 text-green-200',
    error: 'bg-red-800/50 border-red-700 text-red-200',
  };
  const Icon = status === 'success' ? CheckCircle : AlertTriangle;
  return (
    // This animation is clean and professional
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }} // Snappier spring
      className={`flex items-start gap-3 p-4 rounded-lg border ${style[status]} mb-6`}
    >
      <Icon size={20} className="shrink-0 mt-0.5" />
      <p className="font-semibold text-sm">{message}</p>
    </motion.div>
  );
};

// --- Animation Variants for Page Load ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger effect
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Professional ease
    },
  },
};


// --- Main Quote Page Component ---
export default function QuotePage() {
  const router = useRouter(); // For the back button
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    details: '',
  });
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    setMessage('');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Your quote request has been sent!');
        setFormData({ name: '', email: '', phone: '', whatsapp: '', details: '' }); // Clear form
      } else {
        throw new Error(data.error || 'An unknown error occurred.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-svh bg-black text-white">
      
      {/* --- ✨ NEW: Back Button (like packages page) ✨ --- */}
      <motion.button
        onClick={() => router.back()}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-4 sm:top-8 sm:left-8 z-20 inline-flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md p-2.5 text-neutral-300 border border-neutral-700/50 transition-all 
                   hover:bg-neutral-800/80 hover:text-white 
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53A4DB] 
                   focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Go back"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </motion.button>
      
      {/* Main content section with responsive padding */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24 sm:pt-40 sm:pb-32">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-heading uppercase text-center">
              Let's create.
            </h1>
            <p className="mt-4 text-lg text-neutral-300 font-body text-center">
              Get in touch instantly via WhatsApp or fill out the form below.
              We&apos;ll get back to you within one business day.
            </p>
          </motion.div>
          
          {/* PRIMARY ACTION: WHATSAPP */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex justify-center" // Centered
          >
            <WhatsAppButton label="Start on WhatsApp" number={whatsappNumber} />
          </motion.div>

          {/* "OR" DIVIDER */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-4 my-10"
          >
            <div className="h-px flex-grow bg-neutral-800"></div>
            <span className="text-neutral-500 text-sm font-semibold">OR</span>
            <div className="h-px flex-grow bg-neutral-800"></div>
          </motion.div>

          {/* SECONDARY ACTION: EMAIL FORM */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold font-heading text-neutral-200 text-center sm:text-left">
              Send an Email Request
            </h2>

            <AnimatePresence>
              {message && <FormMessage status={status} message={message} />}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-neutral-300">Name *</label>
                <input 
                  type="text" name="name" id="name"
                  value={formData.name} onChange={handleInputChange}
                  required 
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-white outline-none 
                             focus:border-[#53A4DB] focus:ring-1 focus:ring-[#53A4DB]
                             transition-colors disabled:opacity-50"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2 text-neutral-300">Email *</label>
                <input 
                  type="email" name="email" id="email"
                  value={formData.email} onChange={handleInputChange}
                  required 
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-white outline-none 
                             focus:border-[#53A4DB] focus:ring-1 focus:ring-[#53A4DB]
                             transition-colors disabled:opacity-50"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-neutral-300">Primary Phone *</label>
                <input 
                  type="tel" name="phone" id="phone"
                  value={formData.phone} onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-white outline-none 
                             focus:border-[#53A4DB] focus:ring-1 focus:ring-[#53A4DB] 
                             transition-colors disabled:opacity-50"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-semibold mb-2 text-neutral-300">WhatsApp Number *</label>
                <input 
                  type="tel" name="whatsapp" id="whatsapp"
                  value={formData.whatsapp} onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-white outline-none 
                             focus:border-[#53A4DB] focus:ring-1 focus:ring-[#53A4DB] 
                             transition-colors disabled:opacity-50"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-semibold mb-2 text-neutral-300">Project Details *</label>
              <textarea 
                rows={6} name="details" id="details"
                value={formData.details} onChange={handleInputChange}
                required
                className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-white outline-none 
                           focus:border-[#53A4DB] focus:ring-1 focus:ring-[#53A4DB] 
                           transition-colors disabled:opacity-50" 
                placeholder="What are you looking to create? What is your timeline?"
                disabled={isLoading}
              />
            </div>
            
            <div className="pt-4">
              <EmailSubmitButton label="Send Email Request" isLoading={isLoading} />
            </div>

          </motion.form>
        </motion.div>
      </section>
    </main>
  );
}