"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Video, Camera, MessageSquareText, Layers, Loader2, 
  AlertTriangle, BarChart3, Package, Clapperboard, FolderHeart, Users, Eye,
  List, Terminal, Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, isLive = false }) => (
  <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex items-center gap-4">
    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      {isLive ? (
        <div className="relative">
          <Icon size={24} className="text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
      ) : (
        <Icon size={24} className="text-white" />
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-neutral-400">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

// Main Dashboard Page
export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [error, setError] = useState(null);

  // Fetcher for content stats
  const fetchContentStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard-stats');
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch content stats.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Fetcher for all analytics data
  const fetchAnalytics = async () => {
    if (!analytics) {
      setIsLoadingAnalytics(true);
    }
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (res.ok && data.success) {
        setAnalytics(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch analytics.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };
  
  // Fetcher for "live" data only (for polling)
  const fetchLiveData = async () => {
     try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (res.ok && data.success) {
        setAnalytics(prev => ({
          ...(prev || data.data),
          liveVisitors: data.data.liveVisitors,
          latestVisits: data.data.latestVisits,
        }));
      } else {
        throw new Error(data.error || 'Failed to fetch live data.');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchContentStats();
    fetchAnalytics();
    // Poll every 1 minute
    const interval = setInterval(fetchLiveData, 20000); 
    return () => clearInterval(interval); 
  }, []);

  const renderContentStats = () => {
    if (isLoadingContent) {
      return (
        <div className="flex justify-center items-center h-32 col-span-full">
          <Loader2 size={32} className="animate-spin text-[#53A4DB]" />
        </div>
      );
    }
    if (error && !stats) {
      return (
        <div className="col-span-full bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle />
          <p><strong>Error loading content stats:</strong> {error}</p>
        </div>
      );
    }
    if (stats) {
      return (
        <>
          <StatCard title="Video Projects" value={stats.videos} icon={Video} color="bg-cyan-500/30" />
          <StatCard title="Photo Projects" value={stats.photoProjects} icon={FolderHeart} color="bg-purple-500/30" />
          <StatCard title="Total Photos" value={stats.photos} icon={Camera} color="bg-purple-500/30" />
          <StatCard title="BTS Items" value={stats.btsItems} icon={Clapperboard} color="bg-yellow-500/30" />
          <StatCard title="Services" value={stats.services} icon={Layers} color="bg-indigo-500/30" />
          <StatCard title="Packages" value={stats.packages || 0} icon={Package} color="bg-indigo-500/30" />
          <StatCard title="Testimonials" value={stats.testimonials} icon={MessageSquareText} color="bg-green-500/30" />
          <StatCard title="Categories" value={stats.categories} icon={List} color="bg-neutral-500/30" />
        </>
      );
    }
    return null;
  };
  
  const renderAnalytics = () => {
    if (isLoadingAnalytics && !analytics) {
      return (
        <div className="flex justify-center items-center h-80 col-span-full">
          <Loader2 size={32} className="animate-spin text-[#53A4DB]" />
        </div>
      );
    }
    if (error && !analytics) {
       return (
        <div className="col-span-full bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3 mt-12">
          <AlertTriangle />
          <p><strong>Error loading analytics data:</strong> {error}</p>
        </div>
      );
    }
    if (analytics) {
      return (
        <>
          {/* --- Live Stats --- */}
          <h2 className="text-2xl font-semibold text-white mb-4 mt-12">Visitor Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <StatCard 
              title="Live Visitors (5 min)"
              value={analytics.liveVisitors} 
              icon={Users} 
              color="bg-green-500/30" 
              isLive={true} 
            />
            <StatCard title="All-Time Views" value={analytics.allTimeViews} icon={Eye} color="bg-blue-500/30" />
            <StatCard title="All-Time Uniques" value={analytics.allTimeUniques} icon={Users} color="bg-blue-500/30" />
          </div>

          {/* --- Graphs & Lists --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Traffic Graph */}
            <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Daily Page Views (Last 30 Days)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.dailyTraffic} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#ffffff' }}
                      itemStyle={{ color: '#00FFFF' }}
                    />
                    <Bar dataKey="visits" fill="#00FFFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ✨ UPDATED: Top Sources & Referrers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Top Referrers (Domains) */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <LinkIcon size={18} /> Top Referrers
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {analytics.topReferrers.length > 0 ? analytics.topReferrers.map(ref => (
                    <div key={ref._id} className="flex justify-between items-center text-sm">
                      <span className="text-neutral-300 truncate" title={ref._id}>{ref._id || "Direct/Unknown"}</span>
                      <span className="font-bold text-white bg-neutral-700/50 rounded px-2 py-0.5">{ref.count}</span>
                    </div>
                  )) : <p className="text-neutral-500">No referrer data yet.</p>}
                </div>
              </div>

              {/* ✨ NEW: Top Sources (UTM) */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 size={18} /> Top Sources
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {analytics.topSources.length > 0 ? analytics.topSources.map(src => (
                    <div key={src._id} className="flex justify-between items-center text-sm">
                      <span className="text-neutral-300 truncate" title={src._id}>{src._id || "None"}</span>
                      <span className="font-bold text-white bg-neutral-700/50 rounded px-2 py-0.5">{src.count}</span>
                    </div>
                  )) : <p className="text-neutral-500">No UTM source data yet.</p>}
                </div>
              </div>
            </div>

          </div>
          
          {/* Top Pages */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Top Pages (Last 30 Days)</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {analytics.topPages.length > 0 ? analytics.topPages.map(page => (
                  <div key={page._id} className="flex justify-between items-center text-sm">
                    <span className="text-neutral-300 truncate" title={page._id}>{page._id}</span>
                    <span className="font-bold text-white bg-neutral-700/50 rounded px-2 py-0.5">{page.count}</span>
                  </div>
                )) : <p className="text-neutral-500">No page data yet.</p>}
              </div>
          </div>

          {/* Latest Activity (IP Address Log) */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl mt-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Terminal size={20} />
                Latest Activity (Updates every 20 sec)
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar font-mono text-sm">
                {analytics.latestVisits.length > 0 ? analytics.latestVisits.map(visit => (
                  <div key={visit._id} className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <span className="text-neutral-300">{visit.ip}</span>
                    <span className="text-neutral-500">
                      visited <span className="text-cyan-400">{visit.path}</span> at {new Date(visit.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )) : <p className="text-neutral-500">No visits recorded yet.</p>}
              </div>
          </div>
        </>
      );
    }
    
    if (error && !isLoadingAnalytics) {
       return (
        <div className="col-span-full bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3 mt-12">
          <AlertTriangle />
          <p><strong>Error loading analytics data:</strong> {error}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading uppercase text-[#53A4DB]">
          Admin Dashboard
        </h1>
        <p className="text-xl text-neutral-400 mb-10">
          Welcome to the En.Studio admin panel.
        </p>

        {/* --- Content Stats (From our own API) --- */}
        <h2 className="text-2xl font-semibold text-white mb-4">Content at a Glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {renderContentStats()}
        </div>
        
        {/* --- Analytics Section (From our own API) --- */}
        {renderAnalytics()}
        
      </motion.div>
    </div>
  );
}