"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Send } from 'lucide-react'; // Clean icons

/**
 * ButtonPrimary
 * A professional, high-contrast solid button.
 * Accessible focus state without an outline on click.
 */
export const ButtonPrimary = ({ label, href }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12
                 bg-white text-black font-semibold rounded-lg
                 transition-colors duration-300 ease-out
                 hover:bg-neutral-200
                 active:scale-95
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white 
                 focus-visible:ring-offset-2 focus-visible:ring-offset-black" // Professional focus
      aria-label={label}
    >
      <span className="relative z-10">{label}</span>
      <ArrowRight size={18} />
    </Link>
  );
};

/**
 * ButtonSecondary
 * A professional, minimalist button with no border.
 * Accessible focus state without an outline on click.
 */
export const ButtonSecondary = ({ label, href }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12
                 bg-neutral-800/50 text-neutral-200 font-semibold rounded-lg
                 transition-all duration-300 ease-out
                 hover:bg-neutral-700/80 hover:text-white
                 active:scale-95
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600 
                 focus-visible:ring-offset-2 focus-visible:ring-offset-black" // Professional focus
      aria-label={label}
    >
      <span className="relative z-10">{label}</span>
      <Send size={16} />
    </Link>
  );
};