"use client";
import React from "react";
import Link from 'next/link'; // Import Link
import Image from 'next/image'; // Import Image

const Footer = () => {
  return (
    <footer className="bg-black text-neutral-400 py-12 border-t-2 border-neutral-800">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Replaced <a> with <Link> */}
          <Link
            href="/"
            className="select-none active:opacity-90 relative z-10 block"
            aria-label="Go to home"
          >
            {/* Replaced <img> with <Image> */}
            <Image
              src="/logo.png"
              alt="En.Studio Logo"
              width={40} // Provide width (adjust based on h-10 class)
              height={40} // Provide height
              className="w-auto h-8 sm:h-10" // Keep height classes for responsiveness if needed
            />
          </Link>
          <div className="flex gap-8 font-body">
            {/* These internal page links should ideally also be <Link> if they are routes,
                but keeping as <a> for hash links as per original code */}
            <a href="#work" className="hover:text-white transition-colors">
              Work
            </a>
            <a href="#services" className="hover:text-white transition-colors">
              Services
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm font-body">
          <p>
            &copy; {new Date().getFullYear()} En.Studio. All Rights Reserved. <br /> Developed by EnTech.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;