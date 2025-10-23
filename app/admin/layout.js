import Link from 'next/link';
// Import new icons
import { Video, List, LayoutDashboard, Camera, UploadCloud } from 'lucide-react';
import { Bai_Jamjuree } from "next/font/google"; 

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-bai-jamjuree",
});

// Add new links to this array
const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard }, // Added Dashboard link
  { href: '/admin/portfolio', label: 'Add Video Project', icon: Video },
  { href: '/admin/photography/upload', label: 'Upload Photo', icon: UploadCloud }, // NEW
  { href: '/admin/photography/manage', label: 'Manage Photos', icon: Camera }, // NEW
  { href: '/admin/category', label: 'Manage Categories', icon: List },
];

const Sidebar = () => (
  <nav className="fixed left-0 top-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col z-40">
    <div className="flex items-center mb-10">
      <img 
        src="/logo.png" 
        alt="En.Studio Admin" 
        className="h-8 w-auto mr-3"
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
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-cyan-400 transition-colors duration-200"
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
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors"
      >
        <LayoutDashboard size={16} />
        Back to Website
      </Link>
    </div>
  </nav>
);

export default function AdminLayout({ children }) {
  return (
    <html lang="en" className="no-scrollbar">
      <body className={`${baiJamjuree.className} antialiased bg-neutral-950 text-white`}> {/* Added text-white */}
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-64 p-8 md:p-12">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}