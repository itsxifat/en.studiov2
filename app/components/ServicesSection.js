"use client";
import React from 'react';
import { Film, Briefcase, Video } from 'lucide-react';

const services = [
    { icon: <Film className="h-8 w-8 text-cyan-400" />, title: "Brand Films", description: "Crafting cinematic narratives that define your brand's identity.", price: "4,000" },
    { icon: <Briefcase className="h-8 w-8 text-cyan-400" />, title: "Corporate Ads", description: "High-impact commercials that drive engagement and results.", price: "5,500" },
    { icon: <Video className="h-8 w-8 text-cyan-400" />, title: "Event Coverage", description: "Dynamic, multi-camera coverage to capture event energy.", price: "3,000" },
];

const ServicesSection = () => {
    return (
        <section className="py-20 md:py-32 bg-neutral-900 text-white" id="services">
            <div className="container mx-auto px-8">
                <div className="text-center mb-12">
                    <h2 className="section-title text-5xl md:text-7xl font-bold tracking-tight font-heading uppercase">What We Offer</h2>
                    <p className="text-lg text-neutral-400 mt-4 max-w-2xl mx-auto font-body">A suite of services for your creative and business goals.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map(service => (
                        <div key={service.title} className="service-card border-2 border-neutral-800 p-8 text-left transition-all duration-300 hover:border-cyan-400 hover:bg-neutral-800/50 hover:-translate-y-2">
                            <div className="mb-6">{service.icon}</div>
                            <h3 className="text-2xl font-bold mb-3 font-heading">{service.title}</h3>
                            <p className="text-neutral-400 mb-4 font-body">{service.description}</p>
                            <p className="text-cyan-400 font-semibold font-body">Starting at ${service.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
