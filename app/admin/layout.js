"use client"; // Required for hooks and client-side components

import React from 'react';
import Link from 'next/link';
// ✨ Import 'ListVideo' icon
import { 
  Video, 
  List, 
  LayoutDashboard, 
  Camera, 
  UploadCloud, 
  Star, 
  MessageSquareText, 
  Layers, 
  Package, 
  FolderHeart, 
  Clapperboard,
  ListVideo // ✨ Added here
} from 'lucide-react';
import { Bai_Jamjuree } from "next/font/google";
import Image from 'next/image';

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-bai-jamjuree",
});

// --- ✨ UPDATED navLinks array ---
const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/portfolio', label: 'Add Video Project', icon: Video },
  { href: '/admin/portfolio/manage', label: 'Manage Videos', icon: ListVideo }, // ✨ THIS LINK IS NOW ADDED
  { href: '/admin/photography/projects', label: 'Photo Projects', icon: FolderHeart },
  { href: '/admin/photography/upload', label: 'Upload Photo', icon: UploadCloud },
  { href: '/admin/photography/manage', label: 'Manage Photos', icon: Camera },
  { href: '/admin/bts', label: 'Manage BTS', icon: Clapperboard },
  { href: '/admin/featured', label: 'Manage Featured', icon: Star },
  { href: '/admin/testimonials', label: 'Manage Testimonials', icon: MessageSquareText },
  { href: '/admin/services', label: 'Manage Services', icon: Layers },
  { href: '/admin/packages', label: 'Manage Packages', icon: Package },
  { href: '/admin/category', label: 'Manage Categories', icon: List },
];

// --- Custom Scrollbar Styles ---
const GlobalScrollbarStyles = () => (
  <style jsx global>{`
    .admin-sidebar-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .admin-sidebar-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .admin-sidebar-scrollbar::-webkit-scrollbar-thumb {
      background-color: #3f3f46; /* neutral-700 */
      border-radius: 6px;
    }
    .admin-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #52525b; /* neutral-600 */
    }
    .admin-sidebar-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #3f3f46 transparent;
    }
  `}</style>
);

const Sidebar = () => (
  <nav className="fixed left-0 top-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col z-40">
    <GlobalScrollbarStyles /> {/* Adds the custom scrollbar styles */}
    <div className="flex items-center mb-10">
       <Image src="/logo.png" alt="En.Studio Admin" width={32} height={32} className="mr-3" priority />
       <h1 className="text-xl font-bold text-white uppercase tracking-widest">Admin</h1>
    </div>
    
    {/* Added custom scrollbar class */}
    <ul className="space-y-3 overflow-y-auto admin-sidebar-scrollbar pr-2">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              // Removed focus:ring-* classes
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-cyan-400 transition-colors duration-200 focus:outline-none focus:bg-neutral-800"
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
        // Removed focus:ring-* classes
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors focus:outline-none focus:text-white rounded p-1 -m-1"
      >
        <LayoutDashboard size={16} />
        Back to Website
      </Link>
    </div>
  </nav>
);

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className={`${baiJamjuree.variable} font-sans flex-1 ml-64 p-8 md:p-12 bg-neutral-950 text-white`}>
        {children}
      </div>
    </div>
  );
}