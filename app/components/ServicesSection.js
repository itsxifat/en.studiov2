"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';

// --- Icon Map ---
const IconMap = {
  ...LucideIcons,
  default: LucideIcons.Layers, // Default icon
};
const getIcon = (name) => {
  const Icon = IconMap[name];
  return Icon ? <Icon className="h-8 w-8 text-[#53A4DB]" /> : <IconMap.default className="h-8 w-8 text-[#53A4DB]" />;
};

// --- Service Card Component ---
const ServiceCard = ({ service, index }) => (
  <Link href={`/packages/${service._id}`} passHref>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="service-card group relative border border-neutral-800 p-8 text-left transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800/30 hover:-translate-y-1 overflow-hidden h-full flex flex-col rounded-xl" // Cleaned design
    >
      <div className="mb-6">{getIcon(service.icon)}</div>
      <h3 className="text-2xl font-bold mb-3 font-heading text-white">{service.title}</h3>
      <p className="text-neutral-400 mb-4 font-body grow">{service.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <p className="text-[#53A4DB] font-semibold font-body">
          Starting at ৳{service.startingPrice}
        </p>
        <ArrowRight className="text-neutral-600 group-hover:text-[#53A4DB] group-hover:translate-x-1 transition-transform" size={20} />
      </div>
    </motion.div>
  </Link>
);

// --- Loading Skeleton Card ---
const SkeletonCard = () => (
  <div className="border border-neutral-800 p-8 h-[280px] animate-pulse rounded-xl">
    <div className="h-8 w-8 bg-neutral-700 rounded-md mb-6"></div>
    <div className="h-6 w-3/4 bg-neutral-700 rounded-md mb-3"></div>
    <div className="h-4 w-full bg-neutral-700 rounded-md mb-2"></div>
    <div className="h-4 w-5/6 bg-neutral-700 rounded-md mb-4"></div>
    <div className="h-5 w-1/3 bg-neutral-700 rounded-md mt-auto"></div>
  </div>
);

// --- Main Services Section Component ---
const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (res.ok && data.success) {
          setServices(data.data);
        } else {
          console.error(data.error || 'Failed to fetch services');
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    
    if (services.length === 0) {
      return null; // Don't render the section if no services
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard
            key={service._id}
            index={index}
            service={service}
          />
        ))}
      </div>
    );
  };

  return (
    // ✨ FIX: Changed bg-neutral-900 to bg-black ✨
    <section className="py-20 md:py-32 bg-black text-white" id="services">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-5xl md:text-7xl font-bold tracking-tight font-heading uppercase">What We Offer</h2>
          <p className="text-lg text-neutral-400 mt-4 max-w-2xl mx-auto font-body">
            A suite of services for your creative and business goals.
          </p>
        </div>
        {renderContent()}
      </div>
    </section>
  );
};

export default ServicesSection;