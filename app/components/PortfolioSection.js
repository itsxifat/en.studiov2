"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PortfolioSection = () => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Commercial', 'Brand', 'Event', 'Wedding'];

    const portfolioItems = [
        { id: 1, title: "Project Alpha", category: "Commercial", thumbnail: "https://placehold.co/600x400", video: "https://cdn.pixabay.com/video/2024/02/22/201202-916894569_large.mp4" },
        { id: 2, title: "Brand Relaunch", category: "Brand", thumbnail: "https://placehold.co/600x400", video: "https://cdn.pixabay.com/video/2023/04/10/157432-816911181_large.mp4" },
        { id: 3, title: "Summit 2024", category: "Event", thumbnail: "https://placehold.co/600x400", video: "https://cdn.pixabay.com/video/2024/02/09/199745-912239327_large.mp4" },
        { id: 4, title: "Ocean Dreams", category: "Wedding", thumbnail: "https://placehold.co/600x400", video: "https://cdn.pixabay.com/video/2024/05/27/213511-939757656_large.mp4" },
        { id: 5, title: "Future Forward", category: "Commercial", thumbnail: "https://placehold.co/600x400", video: "https://cdn.pixabay.com/video/2023/10/10/182209-873646545_large.mp4" },
    ];

    const filteredItems = filter === 'All' ? portfolioItems : portfolioItems.filter(item => item.category === filter);

    return (
        <section className="py-20 md:py-32 bg-black text-white" id="work">
            <div className="container mx-auto px-8">
                <div className="text-center mb-12">
                    <h2 className="section-title text-5xl md:text-7xl font-bold tracking-tight font-heading uppercase">Featured Work</h2>
                    <p className="text-lg text-neutral-400 mt-4 max-w-2xl mx-auto font-body">A glimpse into stories we’ve brought to life.</p>
                </div>

                <div className="flex justify-center gap-2 mb-12 flex-wrap">
                    {categories.map(category => (
                        <button 
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-5 py-2 text-sm font-semibold transition-colors duration-300 border-2 
                                ${filter === category ? 'bg-cyan-400 text-black border-cyan-400' : 'border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-500'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map(item => (
                        <motion.div key={item.id} className="group relative overflow-hidden aspect-video bg-neutral-900">
                            <img
                                src={item.thumbnail}
                                alt={item.title}  // Accessibility improvement
                                className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                                loading="lazy"  // Performance improvement with lazy loading
                            />

                            <AnimatePresence>
                                {/* Show video only when it matches the current filter */}
                                {filter === 'All' || filter === item.category ? (
                                    <motion.video
                                        key={`video-${item.id}`}
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.5 }}
                                        src={item.video}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : null}
                            </AnimatePresence>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <span className="text-xs text-cyan-400 font-body tracking-widest">{item.category.toUpperCase()}</span>
                                <h3 className="text-2xl font-bold mt-1 text-white font-heading">{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <button className="brutalist-button-secondary" data-magnetic>
                        View Full Portfolio <ArrowRight size={20} className="inline" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PortfolioSection;
