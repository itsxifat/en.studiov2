// app/portfolio/_clientComponents.js
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Search,
  X,
  SearchX,
  Link as LinkIcon,
  Github,
} from "lucide-react";
import YouTubeEmbed from "../components/YouTubeEmbed";
import Link from "next/link"; // Added for Header and Modal links

/* ────────────────────────────────────────────────────────────
   1. Header Component (Previously Missing)
──────────────────────────────────────────────────────────── */
export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
      className="relative z-50"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-2xl font-bold font-heading text-white transition-colors hover:text-cyan-400"
        >
          Enfinito<span className="text-cyan-400">.</span>
        </Link>
        <Link
          href="/contact" // Assuming you have a contact page
          className="group inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-400 transition-colors hover:bg-cyan-400/20"
        >
          Get in Touch
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </motion.header>
  );
}

/* ────────────────────────────────────────────────────────────
   2. Portfolio Card Component (Previously Missing)
──────────────────────────────────────────────────────────── */
const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.6 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

export function PortfolioCard({ item, onOpen }) {
  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[.03] shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-cyan-400/10"
      onClick={() => onOpen(item)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <motion.img
          src={item.thumbnail || "/placeholder.jpg"}
          alt={item.title}
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              {item.category || "General"}
            </span>
            <span className="text-xs text-neutral-400">
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-bold font-heading text-white">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-neutral-300 line-clamp-2">
            {item.description}
          </p>
        </div>
        <div className="mt-5 text-sm font-medium text-cyan-400">
          View Project &rarr;
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   3. Modal Component (Previously Missing)
──────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, item }) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={onClose}
        >
          <motion.div
            // Modal Content
            layoutId={`card-${item._id}`} // This would require layoutId on PortfolioCard
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
            >
              <X size={20} />
            </button>

            {/* Video or Image */}
            <div className="aspect-video w-full bg-black">
              {item.youtubeId ? (
                <YouTubeEmbed embedId={item.youtubeId} />
              ) : (
                <img
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Details */}
            <div className="max-h-[40vh] overflow-y-auto p-6 sm:p-8">
              <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                {item.category}
              </span>
              <h2 className="mt-2 text-3xl font-bold font-heading text-white">
                {item.title}
              </h2>
              <p className="mt-4 text-neutral-300">{item.description}</p>

              {/* Links */}
              <div className="mt-6 flex flex-wrap gap-4">
                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105"
                  >
                    <LinkIcon size={16} />
                    View Live Site
                  </a>
                )}
                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800/50 px-5 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
                  >
                    <Github size={16} />
                    View Code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────────────────────
   4. Toolbar (Improved Responsive Version)
──────────────────────────────────────────────────────────── */
export function Toolbar({
  filter,
  setFilter,
  q,
  setQ,
  sort,
  setSort,
  categories,
}) {
  const categoryList = categories || ["All"];
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center">
        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-1">
          {categoryList.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-bold tracking-wide transition-colors ${
                filter === c
                  ? "border-cyan-400 bg-cyan-400 text-black shadow-lg"
                  : "border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search & Sort Wrapper */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              size={16}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects…"
              className="h-9 w-full rounded-full border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 sm:w-[220px]"
            />
          </div>

          {/* Sort */}
          <div className="w-full sm:w-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 w-full appearance-none rounded-xl border border-white/10 bg-white/5 bg-[right_0.75rem_center] bg-no-repeat px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 sm:w-auto pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              }}
            >
              <option value="newest" className="bg-neutral-900">
                Newest
              </option>
              <option value="title" className="bg-neutral-900">
                Title A–Z
              </option>
              <option value="category" className="bg-neutral-900">
                Category
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   5. Client Portfolio Page (Main Component)
──────────────────────────────────────────────────────────── */
export function ClientPortfolioPage({ initialItems, dynamicCategories }) {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 6;

  const [itemsData, setItemsData] = useState(initialItems);

  // Client-side fallback fetch
  useEffect(() => {
    const fetchLatest = async () => {
      if (!initialItems || initialItems.length === 0) {
        setLoading(true);
        try {
          const res = await fetch("/api/portfolio");
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setItemsData(data.data);
          }
        } catch (err) {
          console.error("Client fetch failed:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchLatest();
  }, [initialItems]);

  // Filtered + searched + sorted data logic
  const items = useMemo(() => {
    let arr = [...itemsData];
    if (filter !== "All") arr = arr.filter((d) => d.category === filter);
    if (q.trim())
      arr = arr.filter((d) =>
        (d.title || "").toLowerCase().includes(q.toLowerCase())
      );

    if (sort === "title")
      arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sort === "category")
      arr.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
    else if (sort === "newest") {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return arr;
  }, [itemsData, filter, q, sort]);

  const paged = items.slice(0, page * perPage);
  const canLoadMore = paged.length < items.length;

  const onOpen = (item) => {
    setActive(item);
    setOpen(true);
  };
  const onClose = () => setOpen(false);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-40 text-center">
        <svg
          className="animate-spin h-10 w-10 text-cyan-400 mx-auto"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9c0-2.33 1.25-4.33 3.04-5.42" />
        </svg>
        <p className="mt-4 text-lg text-neutral-400">
          Fetching cinematic stories...
        </p>
      </section>
    );
  }

  return (
    <>
      <Toolbar
        filter={filter}
        setFilter={setFilter}
        q={q}
        setQ={setQ}
        sort={sort}
        setSort={setSort}
        categories={dynamicCategories}
      />

      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {items.length === 0 ? (
          // Improved "No Projects" State
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center text-neutral-300">
            <SearchX className="mx-auto h-12 w-12 text-neutral-600" />
            <h2 className="mt-6 text-2xl font-bold font-heading text-cyan-400">
              No Projects Found
            </h2>
            <p className="mt-2 text-neutral-400">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {paged.map((item) => (
                  <PortfolioCard key={item._id} item={item} onOpen={onOpen} />
                ))}
              </AnimatePresence>
            </motion.div>

            {canLoadMore && (
              <div className="mt-16 text-center">
                <button
                  onClick={() => setPage((n) => n + 1)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-cyan-500 bg-cyan-500/10 px-6 py-3 text-sm font-bold uppercase tracking-widest text-cyan-400 transition-colors hover:bg-cyan-500/20"
                >
                  Load More Projects <ArrowRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Modal open={open} onClose={onClose} item={active} />
    </>
  );
}