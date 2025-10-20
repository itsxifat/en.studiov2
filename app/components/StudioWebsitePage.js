"use client";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useHomeLoaderGate } from "../hooks/useHomeLoaderGate";

import CustomCursor from "./CustomCursor";
import Header from "./Header";
import HeroSection from "./HeroSection";
import PortfolioSection from "./PortfolioSection";
import ServicesSection from "./ServicesSection";
import AboutSection from "./AboutSection";
import TestimonialsSection from "./TestimonialsSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
// import LoadingScreen from "./LoadingScreen";

export default function StudioWebsitePage() {
  const { showLoader, markPlayed } = useHomeLoaderGate();
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <main className="bg-black font-body text-neutral-300 antialiased overflow-x-hidden">
      {/* <AnimatePresence mode="wait">
        {showLoader && !loaderDone && (
          <LoadingScreen
            key="loader"
            text="En.Studio"
            audioUrl="/sounds/loader-whoosh.mp3"
            audioVolume={0.9}
            enableAudio
            onFinish={() => {
              markPlayed();
              setLoaderDone(true);
            }}
          />
        )}
      </AnimatePresence> */}

      {/* {(!showLoader || loaderDone) && ( */}
        <>
          <CustomCursor />
          <Header />
          <HeroSection />
          <PortfolioSection />
          <ServicesSection />
          <AboutSection />
          <TestimonialsSection />
          <ContactSection />
          <Footer />
        </>
      {/* )} */}
    </main>
  );
}
