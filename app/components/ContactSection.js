"use client";
import React, { useState } from 'react';
import { Mail, MessageSquare, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Reusable Form Status Message Component
const FormMessage = ({ status, message }) => {
  if (!status) return null;
  const style = {
    success: 'bg-green-800/50 border-green-700 text-green-200',
    error: 'bg-red-800/50 border-red-700 text-red-200',
  };
  const Icon = status === 'success' ? CheckCircle : AlertTriangle;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 p-4 rounded-lg border ${style[status]} mb-6`}
    >
      <Icon size={20} className="shrink-0 mt-0.5" />
      <p className="font-semibold text-sm">{message}</p>
    </motion.div>
  );
};

const ContactSection = () => {
  // Updated state to include all required fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    details: '',
  });
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get WhatsApp number from environment
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null;
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

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
      // Use the existing /api/quote route
      const res = await fetch('/api/quote', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Send all 5 fields
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || "Your message has been sent. We'll be in touch shortly.");
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
    <section className="py-20 md:py-32 bg-black text-white" id="contact">
      <div className="container mx-auto px-4 sm:px-8"> {/* Responsive padding */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          
          {/* Left Column: Text Content */}
          <div>
            <h2 className="section-title text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 font-heading uppercase">
              Bring your vision to screen.
            </h2>
            <p className="text-lg text-neutral-400 mb-8 font-body">
              Let&apos;s talk about your next project. Fill out the form,
              send us a message on WhatsApp, or reach out directly.
            </p>
            {/* Contact Details */}
            <div className="space-y-5 text-base sm:text-lg font-body">
              <a 
                href="mailto:enfinito.official@gmail.com"
                className="flex items-center gap-4 text-neutral-200 hover:text-[#53A4DB] transition-colors"
              >
                <Mail className="text-[#53A4DB] shrink-0" size={24} />
                enfinito.official@gmail.com
              </a>
              {/* ✨ NEW: WhatsApp Link ✨ */}
              {whatsappNumber && (
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-neutral-200 hover:text-[#53A4DB] transition-colors"
                >
                  <MessageSquare className="text-[#53A4DB] shrink-0" size={24} />
                  Chat with us on WhatsApp
                </Link>
              )}
            </div>
          </div>
          
          {/* Right Column: Form */}
          {/* ✨ Using a more professional border/bg style */}
          <div className="space-y-6 bg-neutral-900/50 border border-neutral-800 p-6 sm:p-8 rounded-lg">
            
            <AnimatePresence>
              {message && <FormMessage status={status} message={message} />}
            </AnimatePresence>

            {/* Show the form only if success message is not active */}
            {status !== 'success' && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="sr-only">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="contact-name"
                      placeholder="Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="font-body w-full bg-neutral-800 border-2 border-neutral-700 p-3 focus:ring-2 focus:ring-[#53A4DB] focus:border-[#53A4DB] focus:outline-none transition-all rounded-md disabled:opacity-50"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="sr-only">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="contact-email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="font-body w-full bg-neutral-800 border-2 border-neutral-700 p-3 focus:ring-2 focus:ring-[#53A4DB] focus:border-[#53A4DB] focus:outline-none transition-all rounded-md disabled:opacity-50"
                    />
                  </div>
                </div>
                
                {/* ✨ NEW: Phone Fields Grid ✨ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Primary Phone */}
                  <div>
                    <label htmlFor="contact-phone" className="sr-only">Primary Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      id="contact-phone"
                      placeholder="Primary Phone *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="font-body w-full bg-neutral-800 border-2 border-neutral-700 p-3 focus:ring-2 focus:ring-[#53A4DB] focus:border-[#53A4DB] focus:outline-none transition-all rounded-md disabled:opacity-50"
                    />
                  </div>
                  {/* WhatsApp Number */}
                  <div>
                    <label htmlFor="contact-whatsapp" className="sr-only">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      id="contact-whatsapp"
                      placeholder="WhatsApp Number *"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="font-body w-full bg-neutral-800 border-2 border-neutral-700 p-3 focus:ring-2 focus:ring-[#53A4DB] focus:border-[#53A4DB] focus:outline-none transition-all rounded-md disabled:opacity-50"
                    />
                  </div>
                </div>
                
                {/* Project Details */}
                <div>
                  <label htmlFor="contact-details" className="sr-only">Project Details</label>
                  <textarea
                    name="details"
                    id="contact-details"
                    placeholder="Tell us about your project... *"
                    rows="5"
                    value={formData.details}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="w-full font-body bg-neutral-800 border-2 border-neutral-700 p-3 focus:ring-2 focus:ring-[#53A4DB] focus:border-[#53A4DB] focus:outline-none transition-all rounded-md disabled:opacity-50"
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full brutalist-button flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed" 
                  data-magnetic
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    "Let's Create"
                  )}
                </button>
              </form>
            )}
            
            {/* If successful, show a button to reset the form */}
            {status === 'success' && (
              <button 
                  onClick={() => setStatus(null)} // This will reset the form
                  className="w-full brutalist-button"
                  data-magnetic
                >
                  Send Another Message
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;