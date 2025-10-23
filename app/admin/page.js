"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading uppercase text-cyan-400">
          Admin Dashboard
        </h1>
        <p className="text-xl text-neutral-400 mb-10">
          Welcome to the En.Studio admin panel.
        </p>

        <div className="bg-neutral-900/70 border border-neutral-700/50 p-8 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <LayoutDashboard size={40} className="text-cyan-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Content Management</h2>
              <p className="text-neutral-300">
                Use the navigation menu on the left to manage your portfolio content. You can add new video projects, upload and manage your photography gallery, and organize your project categories.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}