import Link from 'next/link';
import { Video, List, LayoutDashboard, Camera, UploadCloud } from 'lucide-react';
import { Bai_Jamjuree } from "next/font/google";
import Image from 'next/image'; // Import Image

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-bai-jamjuree",
});

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/portfolio', label: 'Add Video Project', icon: Video },
  { href: '/admin/photography/upload', label: 'Upload Photo', icon: UploadCloud },
  { href: '/admin/photography/manage', label: 'Manage Photos', icon: Camera },
  { href: '/admin/category', label: 'Manage Categories', icon: List },
];

const Sidebar = () => (
  <nav className="fixed left-0 top-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col z-40">
    <div className="flex items-center mb-10">
      {/* Replaced <img> with <Image> */}
      <Image
        src="/logo.png"
        alt="En.Studio Admin"
        width={32} // Provide width based on h-8
        height={32} // Provide height
        className="w-auto h-8 mr-3" // Keep h-8 if needed, width is handled
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

// Correct layout structure (no html/body)
export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Apply font and background to the main content area if needed */}
      <div className={`${baiJamjuree.variable} font-sans flex-1 ml-64 p-8 md:p-12 bg-neutral-950 text-white`}>
        {children}
      </div>
    </div>
  );
}

// Note: Ensure your root layout (app/layout.js) applies the font correctly to the <body>
// Example app/layout.js:
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" className={`${baiJamjuree.variable} no-scrollbar`}>
//       <body className="font-sans antialiased bg-neutral-950 text-white"> {/* Apply font here */}
//         {children}
//       </body>
//     </html>
//   );
// }