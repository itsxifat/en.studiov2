"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-neutral-400 py-12 border-t-2 border-neutral-800">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <a
            
            href="/"
            className="select-none active:opacity-90 relative z-10 block"
            aria-label="Go to home"
          >
            <img
              src="/logo.png"
              alt="En.Studio Logo"
              className="h-8 sm:h-10 w-auto"
            />
          </a>
          <div className="flex gap-8 font-body">
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
