"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const CATEGORY_API = '/api/admin/category';

export default function AdminPortfolioPage() {
    const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);

    // Fetch categories on load
    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(CATEGORY_API);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                // Filter out 'All' as it's not a valid category to assign items to
                setCategories(data.data.filter(c => c.name !== 'All'));
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('Adding item...');

        const form = e.target;
        const title = form.title.value;
        const category = form.category.value;
        const youtubeLink = form.youtubeLink.value;
        const thumbnail = form.thumbnail.value;

        const res = await fetch('/api/portfolio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, category, youtubeLink, thumbnail }),
        });

        const data = await res.json();
        
        if (data.success) {
            setStatus('success');
            setMessage('Portfolio item added successfully!');
            form.reset();
        } else {
            setStatus('error');
            setMessage(`Error: ${data.error || 'Something went wrong.'}`);
        }
        
        setTimeout(() => setStatus(null), 5000);
    };
    
    // Dynamic message box component
    const Message = ({ status, message }) => {
        if (!status) return null;
        
        const style = {
            success: 'bg-green-900/50 text-green-400 border-green-700',
            error: 'bg-red-900/50 text-red-400 border-red-700',
            loading: 'bg-cyan-900/50 text-cyan-400 border-cyan-700',
        };
        const Icon = status === 'success' ? CheckCircle : status === 'error' ? AlertTriangle : Loader2;

        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-center gap-3 p-4 rounded-lg border ${style[status]}`}
            >
                <Icon size={20} className={status === 'loading' ? 'animate-spin' : ''} />
                <p className="font-semibold">{message}</p>
            </motion.div>
        );
    };


    return (
        <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-heading uppercase text-cyan-400">
                Add New Portfolio Video
            </h1>

            <AnimatePresence>{status && <Message status={status} message={message} key="message" />}</AnimatePresence>

            <div className="bg-neutral-900/50 border-2 border-neutral-800 p-8 rounded-xl shadow-2xl mt-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold mb-2 text-neutral-300">Project Title</label>
                        <input 
                            id="title" 
                            name="title" 
                            type="text" 
                            required 
                            disabled={status === 'loading'}
                            className="w-full font-body bg-neutral-800 border-2 border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-white placeholder-neutral-500"
                            placeholder="Enter project name (max 60 chars)"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="category" className="block text-sm font-semibold mb-2 text-neutral-300">Category</label>
                        <select 
                            id="category" 
                            name="category" 
                            required 
                            defaultValue=""
                            disabled={status === 'loading' || categories.length === 0}
                            className="w-full font-body bg-neutral-800 border-2 border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-white"
                        >
                            <option value="" disabled>
                                {categories.length === 0 ? "Loading categories..." : "Select a category"}
                            </option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name} className="bg-neutral-800">{cat.name}</option>
                            ))}
                        </select>
                         {categories.length === 0 && (
                            <p className="text-sm mt-2 text-red-400">
                                Please <a href="/admin/category" className="underline font-bold">add categories</a> before adding a portfolio item.
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="youtubeLink" className="block text-sm font-semibold mb-2 text-neutral-300">YouTube Link (URL)</label>
                        <input 
                            id="youtubeLink" 
                            name="youtubeLink" 
                            type="url" 
                            pattern="https?://(www\.)?(youtu\.be/|youtube\.com/(watch\?(.*&)?v=|(embed|v)/))([\w-]{11})(.*)?"
                            placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID"
                            required 
                            disabled={status === 'loading'}
                            className="w-full font-body bg-neutral-800 border-2 border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-white placeholder-neutral-500"
                        />
                         <p className="text-xs mt-1 text-neutral-500">The video ID will be automatically extracted and saved.</p>
                    </div>
                    
                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-semibold mb-2 text-neutral-300">Custom Thumbnail URL (Optional)</label>
                        <input 
                            id="thumbnail" 
                            name="thumbnail" 
                            type="url" 
                            placeholder="https://yourimage.com/thumbnail.jpg (Leave blank for YouTube default)"
                            disabled={status === 'loading'}
                            className="w-full font-body bg-neutral-800 border-2 border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-white placeholder-neutral-500"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={status === 'loading' || categories.length === 0}
                        className="w-full inline-flex items-center justify-center brutalist-button bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:text-neutral-400"
                    > 
                        {status === 'loading' ? (
                            <>
                                <Loader2 size={20} className="mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : 'Add Portfolio Item'}
                    </button>
                </form>
            </div>
        </div>
    );
}