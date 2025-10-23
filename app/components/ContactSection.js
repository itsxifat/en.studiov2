"use client";
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const ContactSection = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  if (formSubmitted) {
    return (
      <section className="py-20 md:py-32 bg-black text-white" id="contact">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 font-heading uppercase text-cyan-400">
            Thank You!
          </h2>
          <p className="text-lg text-neutral-300 font-body">
            Your message has been sent. We&apos;ll be in touch shortly.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-black text-white" id="contact">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="section-title text-5xl md:text-7xl font-bold tracking-tight mb-4 font-heading uppercase">
              Bring your vision to screen.
            </h2>
            <p className="text-lg text-neutral-400 mb-8 font-body">
              Let&apos;s talk about your next project. Fill out the form or reach out directly.
            </p>
            <div className="space-y-4 text-lg font-body">
              <p className="flex items-center gap-4">
                <Mail className="text-cyan-400" /> hello@motionstudio.com
              </p>
            </div>
          </div>
          <div className="space-y-6 bg-neutral-900/50 border-2 border-neutral-800 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  className="font-body bg-neutral-800 border-2 border-neutral-700 p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="font-body bg-neutral-800 border-2 border-neutral-700 p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
                />
              </div>
              <textarea
                placeholder="Tell us about your project..."
                rows="5"
                required
                className="w-full font-body bg-neutral-800 border-2 border-neutral-700 p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
              ></textarea>
              <button type="submit" className="w-full brutalist-button" data-magnetic>
                Let&apos;s Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
