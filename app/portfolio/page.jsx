// app/portfolio/page.js

import React from "react";
import dbConnect from '../lib/dbConnect';
import PortfolioItem from '../models/portfolioItem';
// Import Client Components from the adjacent file
import { ClientPortfolioPage, Header } from './_clientComponents';

// --- SERVER-SIDE DATA FETCHING ---
async function getPortfolioData() {
  await dbConnect();
  try {
    const items = await PortfolioItem.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("Database fetch failed:", error);
    return [];
  }
}

// --- DEFAULT EXPORT: ASYNC SERVER COMPONENT ---
export default async function PortfolioPage() {
  const initialItems = await getPortfolioData();

  // --- ✨ FIX 1: CALCULATE DYNAMIC CATEGORIES ---
  // Get all categories, filter out any empty ones, create a unique set, and sort them.
  const categories = [
    ...new Set(initialItems.map(item => item.category).filter(Boolean))
  ].sort();
  
  // Add "All" to the beginning of the list
  const dynamicCategories = ["All", ...categories];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Client Component Header for Mouse effects */}
      <Header />

      {/* The main client component now receives BOTH the initial data 
        AND the calculated list of categories.
      */}
      <ClientPortfolioPage 
        initialItems={initialItems} 
        dynamicCategories={dynamicCategories} // <-- PASSING THE PROP
      />

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-neutral-400">
          © {new Date().getFullYear()} Enfinito · Crafted with care
        </div>
      </footer>
    </main>
  );
}