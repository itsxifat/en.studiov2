import Header from "./Header";
import HeroSection from "./hero/HeroSection";
import PortfolioSection from "./PortfolioSection";
import ServicesSection from "./ServicesSection";
import TestimonialsSection from "./TestimonialsSection";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

// Server component: every section below declares its own client boundary.
// `overflow-x-clip` (not hidden) keeps <html> as the scroll container so the
// hero's CSS view-timeline stays active.
export default function StudioWebsitePage({ items = [] }) {
  return (
    <main className="bg-black text-neutral-300 antialiased overflow-x-clip">
      <Header />
      <HeroSection items={items} />
      <PortfolioSection initialItems={items} />
      <ServicesSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
