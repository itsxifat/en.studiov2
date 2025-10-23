import Link from 'next/link';
// Make sure Star is imported
import { Video, List, LayoutDashboard, Camera, UploadCloud, Star } from 'lucide-react';
import { Bai_Jamjuree } from "next/font/google";
import Image from 'next/image'; // Use Next.js Image

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-bai-jamjuree",
});

// Updated navLinks array including "Manage Featured"
const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/portfolio', label: 'Add Video Project', icon: Video },
  { href: '/admin/photography/upload', label: 'Upload Photo', icon: UploadCloud },
  { href: '/admin/photography/manage', label: 'Manage Photos', icon: Camera },
  { href: '/admin/featured', label: 'Manage Featured', icon: Star }, // Ensure this link is present
  { href: '/admin/category', label: 'Manage Categories', icon: List },
];

const Sidebar = () => (
  <nav className="fixed left-0 top-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col z-40">
    <div className="flex items-center mb-10">
      {/* Using Next.js Image component for optimization */}
      <Image
        src="/logo.png"
        alt="En.Studio Admin"
        width={32} // Provided width based on h-8 class
        height={32} // Provided height (adjust if logo aspect ratio is different)
        className="w-auto h-8 mr-3" // h-8 class might be redundant but kept for potential styling
        priority // Add priority if logo is above the fold
      />
      <h1 className="text-xl font-bold text-white uppercase tracking-widest">Admin</h1>
    </div>

    <ul className="space-y-3">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-cyan-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-neutral-900" // Added focus styles
            >
              <Icon size={20} />
              <span className="font-semibold text-sm tracking-wide">{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>

    <div className="mt-auto pt-6 border-t border-neutral-800">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded p-1 -m-1" // Added focus styles and adjusted padding for focus ring
      >
        <LayoutDashboard size={16} />
        Back to Website
      </Link>
    </div>
  </nav>
);

// Correct layout structure (no html/body tags)
export default function AdminLayout({ children }) {
  return (
    // This div container sets up the sidebar + main content layout
    <div className="flex min-h-screen">
      <Sidebar />
      {/* This div is the main content area */}
      {/* Applying font variables and base styles here */}
      <div className={`${baiJamjuree.variable} font-sans flex-1 ml-64 p-8 md:p-12 bg-neutral-950 text-white`}>
        {children}
      </div>
    </div>
  );
}
