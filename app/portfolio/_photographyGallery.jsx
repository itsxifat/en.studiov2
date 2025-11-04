"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 as Loader, AlertTriangle, SearchX, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Use Link for navigation

// --- ✨ NEW: Project Card Component ✨ ---
const ProjectCard = ({ project }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-900 shadow-lg"
    >
      <Link href={`/portfolio/photography/${project.slug}`} className="contents">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover h-full w-full transition-all duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        
        {/* Content Container */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold font-heading text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-neutral-400 line-clamp-3 mb-4 flex-grow">
            {project.description}
          </p>
          <div className="mt-auto pt-3 border-t border-neutral-800/50">
            <p className="flex items-center justify-end text-sm font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View Project
              <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


// --- Main Photography Gallery Component (Now shows projects) ---
export function PhotographyGallery() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/photo-projects'); // Fetching projects
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch projects.');
        }

        setProjects(data.data || []);
      } catch (err) {
        console.error("Failed to fetch photo projects:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center py-20">
          <Loader size={40} className="animate-spin text-cyan-500 mb-4" aria-label="Loading projects" />
          <p className="text-lg text-neutral-400 font-medium">Loading Photography Projects...</p>
        </div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 rounded-xl border border-red-800/50 bg-gradient-to-br from-red-900/20 to-neutral-950/40 p-12 py-16 text-center"
        >
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-5" aria-hidden="true" />
          <h2 className="text-2xl font-bold font-heading text-red-300 mb-2">Error Loading Projects</h2>
          <p className="mt-2 text-base text-neutral-400">{error}</p>
        </motion.div>
      );
    }

    if (projects.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900/40 to-neutral-950/40 p-12 py-16 text-center"
        >
          <SearchX className="mx-auto h-16 w-16 text-neutral-600 mb-5" aria-hidden="true" />
          <h2 className="text-2xl font-bold font-heading text-neutral-200 mb-2">No Photo Projects Found</h2>
          <p className="mt-2 text-base text-neutral-400">Come back soon to see our latest photography work.</p>
        </motion.div>
      );
    }

    // Render the grid of projects
    return (
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence>
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
      {/* This component no longer needs a modal, so it's removed. */}
      {/* The modal is now on the [slug] page. */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 min-h-[60vh]">
        {renderContent()}
      </section>
    </>
  );
}