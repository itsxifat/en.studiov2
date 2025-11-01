"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ButtonPrimary, ButtonSecondary } from "./ui/StyledButtons"; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const HeroSection = () => {
  return (
    <section 
      className="relative w-full flex items-center justify-center text-center text-white overflow-hidden bg-black"
      style={{ minHeight: '100dvh' }}
    >
      {/* Pure Black Background - All textures removed */}
      <div className="absolute inset-0 z-0 bg-black" />
      
      <motion.div
        className="relative z-10 p-4 sm:p-8 max-w-5xl mx-auto flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          className="text-sm md:text-base text-neutral-400 uppercase tracking-widest font-body"
        >
          A creative venture by Enfinito
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none my-5 sm:my-6 uppercase font-heading"
        >
          Powerful Storytelling
          <br />
          <span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            Stunning Visuals.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-body"
        >
          We are a full-service production studio, bringing your ideas to life
          with cinematic precision and creative passion.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-10"
        >
          <ButtonPrimary href="/portfolio" label="View Portfolio" />
          <ButtonSecondary href="/quote" label="Get a Quote" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;