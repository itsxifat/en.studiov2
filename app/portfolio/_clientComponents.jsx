// app/portfolio/_clientComponents.jsx
"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Search,
  X,
  SearchX,
  Link as LinkIcon,
  Github,
  PlayCircle,
  ChevronDown,
  Loader2 as Loader,
  Code,
  ExternalLink,
  Maximize2,
} from "lucide-react";

/* ---------------------------------------------------------------------------
  Custom Scrollbar & Animation Styles
  --------------------------------------------------------------------------- */

const GlobalScrollbarStyles = () => (
  <style jsx global>{`
    /* Custom Scrollbar */
    .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 30, 35, 0.5); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(100, 116, 139, 0.5); border-radius: 4px; border: 2px solid transparent; background-clip: content-box; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(150, 166, 189, 0.6); }
    .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(100, 116, 139, 0.5) rgba(30, 30, 35, 0.5); }
    .custom-scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(100, 116, 139, 0.3); border-radius: 4px; border: 0; background-clip: initial; }
    .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: rgba(150, 166, 189, 0.4); }
    .custom-scrollbar-thin { scrollbar-width: thin; scrollbar-color: rgba(100, 116, 139, 0.3) transparent; }

    @keyframes gradient-flow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-flow {
      animation: gradient-flow 6s ease infinite;
    }

    /* Pulse animation for play button */
    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    .animate-pulse-ring {
      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `}</style>
);

/* ---------------------------------------------------------------------------
  YouTubeEmbed (Standard Implementation)
  --------------------------------------------------------------------------- */
function YouTubeEmbed({ youtubeId, title, autoPlay = false }) {
  const videoSrc = `https://www.youtube.com/embed/${youtubeId}?${autoPlay ? "autoplay=1&" : ""}rel=0&showinfo=0&iv_load_policy=3`;
  return (
    <iframe
      src={videoSrc}
      title={title || "YouTube video player"}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 h-full w-full"
    />
  );
}

/* ──────────────────────
  Enhanced Portfolio Card with Crystal Clear Thumbnails
  ────────────────────── */
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.6, bounce: 0.4 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
};

const cardHoverVariant = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -8,
    transition: { type: "spring", stiffness: 400, damping: 20 }
  },
};

const imageHoverVariant = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }
};

export function PortfolioCard({ item, onOpen }) {
  const hasTags = Array.isArray(item.tags) && item.tags.length > 0;

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-800/60 bg-gradient-to-br from-neutral-900 to-neutral-950 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-shadow duration-300"
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(item)}
      aria-label={`View project: ${item?.title || "Untitled"}`}
    >
      {/* Crystal Clear Image Container - No Play Icon */}
      <motion.div
        variants={cardHoverVariant}
        className="relative overflow-hidden aspect-[16/9] border-b border-neutral-800/60 bg-neutral-950"
      >
        <motion.div
          variants={imageHoverVariant}
          className="absolute inset-0"
        >
          <img
            src={item?.thumbnail || "/placeholder.jpg"}
            alt={item?.title || "Portfolio item thumbnail"}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </motion.div>

        {/* Category Badge - Positioned on image */}
        <div className="absolute top-3 left-3 z-10">
          <span className="rounded-lg bg-black/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 border border-cyan-500/30 shadow-lg">
            {item?.category || "General"}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent pointer-events-none" aria-hidden="true" />
      </motion.div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold font-heading text-neutral-100 line-clamp-2 leading-tight mb-2 group-hover:text-cyan-400 transition-colors duration-200">
          {item?.title || "Untitled Project"}
        </h3>

        <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed mb-4 flex-grow">
          {item?.description || "No description provided."}
        </p>

        {/* Tags Section */}
        {hasTags && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {item.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-neutral-800/80 border border-neutral-700/50 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-700/80 hover:text-cyan-300 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 4 && (
                <span className="rounded-md bg-cyan-900/30 border border-cyan-700/50 px-2.5 py-1 text-xs font-medium text-cyan-400">
                  +{item.tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* View Details Button */}
        <div className="mt-auto pt-3 border-t border-neutral-800/50">
          <div className="flex items-center justify-between text-cyan-400 text-sm font-medium">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              View Details
            </span>
            <div className="ml-auto transform transition-transform duration-200 group-hover:translate-x-1">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────
  Enhanced Modal with YouTube-style Layout
  ────────────────────── */
export function Modal({ open, onClose, item }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = prevOverflow || "";
    };
  }, [open, onClose]);

  const hasTags = Array.isArray(item?.tags) && item.tags.length > 0;
  const hasLinks = item?.liveUrl || item?.githubUrl;
  
  if (!item) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 backdrop-blur-xl"
          style={{ backgroundColor: "rgba(5, 5, 10, 0.92)" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <motion.div
            key={item._id || item.title}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 } }}
            exit={{ scale: 0.95, opacity: 0, y: 30, transition: { duration: 0.2, ease: "easeIn" } }}
            className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-neutral-700/50 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 shadow-2xl flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9, rotate: 0 }}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 z-30 rounded-full bg-black/70 backdrop-blur-sm p-2 sm:p-2.5 text-neutral-300 border border-neutral-700/50 transition-colors hover:bg-red-600/80 hover:text-white hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg"
              aria-label="Close modal"
            >
              <X size={20} strokeWidth={2.5} />
            </motion.button>

            {/* Video Container */}
            <div className="relative w-full bg-black flex-shrink-0 shadow-2xl" style={{ aspectRatio: '16/9' }}>
              {item?.youtubeId ? (
                <YouTubeEmbed youtubeId={item.youtubeId} title={item.title} autoPlay={true} />
              ) : item?.thumbnail ? (
                <div className="relative h-full w-full">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title || "Project visual"} 
                    className="absolute inset-0 h-full w-full object-contain bg-black"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 text-neutral-500 text-base">
                  <div className="text-center">
                    <SearchX size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="italic">No preview available</p>
                  </div>
                </div>
              )}
            </div>

            {/* YouTube-style Details Section Below Video */}
            <div className="overflow-y-auto flex-grow custom-scrollbar bg-gradient-to-b from-neutral-900 to-neutral-950">
              <div className="p-4 sm:p-6 lg:p-8">
                
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-cyan-900/40 border border-cyan-700/50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300 shadow-sm">
                    <Code size={12} />
                    {item?.category || "General"}
                  </span>
                </div>

                {/* Title */}
                <h2 id="modal-title" className="text-xl sm:text-2xl lg:text-3xl font-bold font-heading text-neutral-100 leading-tight mb-4">
                  {item?.title || "Untitled Project"}
                </h2>

                {/* Action Buttons - Responsive Layout */}
                {hasLinks && (
                  <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-neutral-800/50">
                    {item?.liveUrl && (
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-bold text-white shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                        aria-label="View live site"
                      >
                        <ExternalLink size={16} aria-hidden="true" /> 
                        <span>Live Site</span>
                      </motion.a>
                    )}
                    {item?.githubUrl && (
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-neutral-600/70 bg-neutral-800/50 backdrop-blur-sm px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-bold text-neutral-200 shadow-lg hover:border-neutral-500 hover:bg-neutral-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                        aria-label="View source code on GitHub"
                      >
                        <Github size={16} aria-hidden="true" /> 
                        <span>View Code</span>
                      </motion.a>
                    )}
                  </div>
                )}

                {/* Description */}
                {item?.description && (
                  <div className="mb-6">
                    <p id="modal-description" className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Technologies Section */}
                {hasTags && (
                  <div className="pt-6 border-t border-neutral-800/50">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                      <Code size={14} />
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {item.tags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="rounded-lg bg-gradient-to-br from-neutral-700/50 to-neutral-800/50 border border-neutral-600/40 px-3 py-2 text-xs sm:text-sm font-semibold text-cyan-300 hover:border-cyan-500/50 hover:bg-gradient-to-br hover:from-cyan-900/30 hover:to-blue-900/30 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-cyan-500/20"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────
  Toolbar Component (Unchanged but styled better)
  ────────────────────── */
export function Toolbar({ filter, setFilter, q, setQ, sort, setSort, categories }) {
  const categoryList = useMemo(() => {
    const safeCategories = Array.isArray(categories) ? categories : [];
    const uniqueCategories = [...new Set(safeCategories.filter((c) => c))];
    return ["All", ...uniqueCategories];
  }, [categories]);

  const handleFilterClick = (category) => setFilter(category);

  return (
    <div className="sticky top-0 z-40 border-b border-neutral-800/50 bg-black/90 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-3.5 px-4 py-3 sm:flex-row sm:items-center sm:gap-5 sm:py-3">
        <nav className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 sm:flex-1 custom-scrollbar-thin" aria-label="Filter portfolio categories">
          {categoryList.map((c) => (
            <motion.button
              key={c}
              onClick={() => handleFilterClick(c)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-shrink-0 whitespace-nowrap rounded-lg border px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500/80 focus:ring-offset-2 focus:ring-offset-black/90 ${
                filter === c
                  ? "border-transparent text-white shadow-lg shadow-cyan-500/30"
                  : "border-neutral-700/80 text-neutral-400 hover:border-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-100"
              }`}
              aria-pressed={filter === c}
            >
              {filter === c && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 z-0 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{c}</span>
            </motion.button>
          ))}
        </nav>

        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="relative w-full sm:w-auto">
            <label htmlFor="portfolio-search" className="sr-only">
              Search projects
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} aria-hidden="true" />
            <input
              id="portfolio-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects..."
              type="search"
              className="h-10 w-full rounded-lg border border-neutral-700/80 bg-neutral-800/50 pl-9 pr-4 text-sm text-white placeholder:text-neutral-500/90 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:w-[200px] transition-all duration-200"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <label htmlFor="portfolio-sort" className="sr-only">
              Sort projects by
            </label>
            <select
              id="portfolio-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-neutral-700/80 bg-neutral-800/50 py-0 pl-4 pr-9 text-sm text-neutral-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:w-auto cursor-pointer transition-all duration-200"
            >
              <option value="newest" className="bg-neutral-800 text-white">Newest First</option>
              <option value="title" className="bg-neutral-800 text-white">Title A–Z</option>
              <option value="category" className="bg-neutral-800 text-white">Category</option>
            </select>
            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────
  ClientPortfolioPage
  ────────────────────── */
export function ClientPortfolioPage({ 
  items: initialItems,
  categories: dynamicCategories,
  isLoading
}) {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 9;

  const items = useMemo(() => {
    let arr = Array.isArray(initialItems) ? [...initialItems] : [];

    if (filter !== "All") arr = arr.filter((d) => (d?.category || "") === filter);

    const query = q.trim().toLowerCase();
    if (query) {
      arr = arr.filter(
        (d) =>
          (d?.title || "").toLowerCase().includes(query) ||
          (d?.description || "").toLowerCase().includes(query) ||
          (Array.isArray(d?.tags) && d.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    if (sort === "title") {
      arr.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
    } else if (sort === "category") {
      arr.sort((a, b) => (a?.category || "").localeCompare(b?.category || ""));
    } else {
      arr.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
    }

    return arr;
  }, [initialItems, filter, q, sort]);

  const paged = useMemo(() => items.slice(0, page * perPage), [items, page, perPage]);
  const canLoadMore = useMemo(() => paged.length < items.length, [paged.length, items.length]);

  const onOpen = useCallback((item) => {
    setActive(item);
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => { setActive(null); }, 300); 
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, q, sort]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center py-20">
          <Loader size={40} className="animate-spin text-cyan-500 mb-4" aria-label="Loading projects" />
          <p className="text-lg text-neutral-400 font-medium">Loading Projects...</p>
          <p className="text-sm text-neutral-500 mt-2">Please wait while we fetch amazing work</p>
        </div>
      );
    }

    if (items.length === 0 && !isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-12 rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900/40 to-neutral-950/40 backdrop-blur-sm p-12 py-16 text-center"
        >
          <SearchX className="mx-auto h-16 w-16 text-neutral-600 mb-5" aria-hidden="true" />
          <h2 className="text-2xl font-bold font-heading text-neutral-200 mb-2">No Projects Found</h2>
          <p className="mt-2 text-base text-neutral-400">{q ? `No results match "${q}". ` : ""}Try adjusting your search or filters.</p>
        </motion.div>
      );
    }

    return (
      <>
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          <AnimatePresence mode="popLayout">
            {paged.map((item) => (
              <PortfolioCard key={item?._id || item?.title} item={item} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </motion.div>

        {canLoadMore && (
          <div className="mt-16 text-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => setPage((prevPage) => prevPage + 1)}
              className="group inline-flex items-center gap-3 rounded-full border-2 border-cyan-600/70 bg-gradient-to-br from-cyan-900/50 to-blue-900/40 backdrop-blur-sm px-8 py-4 text-sm font-bold uppercase tracking-wider text-cyan-300 shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-800/60 hover:to-blue-800/50 hover:border-cyan-500 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Load More Projects 
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 duration-200" aria-hidden="true" />
            </motion.button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <GlobalScrollbarStyles /> 

      <Toolbar 
        filter={filter} 
        setFilter={setFilter} 
        q={q} 
        setQ={setQ} 
        sort={sort} 
        setSort={setSort} 
        categories={dynamicCategories}
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 min-h-[60vh]">
        {renderContent()}
      </section>

      <Modal open={open} onClose={onClose} item={active} />
    </>
  );
}