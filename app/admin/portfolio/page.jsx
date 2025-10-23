// app/admin/portfolio/page.jsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const CATEGORY_API = '/api/admin/category';
const PORTFOLIO_API = '/api/portfolio'; // Added constant

export default function AdminPortfolioPage() {
    const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

    // Fetch categories on load
    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(CATEGORY_API);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setCategories(data.data.filter(c => c.name !== 'All'));
            } else {
                setStatus('error');
                setMessage('Failed to load categories.');
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setStatus('error');
            setMessage('Network error fetching categories.');
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent double submission

        setIsSubmitting(true);
        setStatus('loading');
        setMessage('Adding portfolio item...');

        const form = e.target;
        const formData = {
            title: form.title.value,
            category: form.category.value,
            description: form.description.value, // ✨ ADDED
            youtubeLink: form.youtubeLink.value,
            thumbnail: form.thumbnail.value,
            liveUrl: form.liveUrl.value, // ✨ ADDED
            githubUrl: form.githubUrl.value, // ✨ ADDED
        };

        try {
            const res = await fetch(PORTFOLIO_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus('success');
                setMessage('Portfolio item added successfully!');
                form.reset();
            } else {
                setStatus('error');
                setMessage(`Error: ${data.error || 'Something went wrong.'} (Status: ${res.status})`);
            }
        } catch (error) {
            setStatus('error');
            setMessage(`Network Error: ${error.message || 'Failed to submit.'}`);
        } finally {
            setIsSubmitting(false); // Re-enable form
            // Keep message displayed longer on error
            setTimeout(() => setStatus(null), status === 'error' ? 8000 : 5000);
        }
    };

    // Dynamic message box component (no changes needed)
    const Message = ({ status, message }) => {
        // ... (keep existing Message component code)
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
                className={`flex items-center gap-3 p-4 rounded-lg border ${style[status]} mb-6`} // Added margin-bottom
            >
                <Icon size={20} className={status === 'loading' ? 'animate-spin' : ''} />
                <p className="font-semibold">{message}</p>
            </motion.div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto"> {/* Centered form */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-heading uppercase text-cyan-400">
                Add New Portfolio Item
            </h1>

            <AnimatePresence>{status && <Message status={status} message={message} key="message" />}</AnimatePresence>

            {/* Adjusted styles for better appearance */}
            <div className="bg-neutral-900/70 border border-neutral-700/50 p-8 rounded-xl shadow-lg mt-8 backdrop-blur-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold mb-2 text-neutral-300">Project Title *</label>
                        <input
                            id="title" name="title" type="text" required maxLength={100}
                            disabled={isSubmitting}
                            className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
                            placeholder="Enter project name"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-semibold mb-2 text-neutral-300">Category *</label>
                        <select
                            id="category" name="category" required defaultValue=""
                            disabled={isSubmitting || categories.length === 0}
                            className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white disabled:opacity-50 appearance-none bg-[right_1rem_center] bg-no-repeat"
                             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`}}
                        >
                            <option value="" disabled>
                                {categories.length === 0 ? "Loading categories..." : "Select a category"}
                            </option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                         {categories.length === 0 && (
                            <p className="text-sm mt-2 text-yellow-400">
                                Note: You need to <a href="/admin/category" className="underline font-bold hover:text-cyan-400">add categories</a> before you can assign one.
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold mb-2 text-neutral-300">Description</label>
                        <textarea
                            id="description" name="description" rows={4}
                            disabled={isSubmitting}
                            className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
                            placeholder="Briefly describe the project (optional)"
                        />
                    </div>

                    {/* YouTube Link */}
                    <div>
                        <label htmlFor="youtubeLink" className="block text-sm font-semibold mb-2 text-neutral-300">YouTube Link (URL)</label>
                        <input
                            id="youtubeLink" name="youtubeLink" type="url"
                            pattern="https?://(www\.)?(youtu\.be/|youtube\.com/(watch\?(.*&)?v=|(embed|v)/))([\w-]{11})(.*)?" // Basic pattern
                            placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID (Optional)"
                            disabled={isSubmitting}
                            className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
                        />
                         <p className="text-xs mt-1 text-neutral-500">The 11-character video ID will be extracted automatically.</p>
                    </div>

                    {/* Custom Thumbnail */}
                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-semibold mb-2 text-neutral-300">Custom Thumbnail URL (Optional)</label>
                        <input
                            id="thumbnail" name="thumbnail" type="url"
                            placeholder="https://.../image.jpg (Overrides YouTube default)"
                            disabled={isSubmitting}
                            className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
                        />
                         <p className="text-xs mt-1 text-neutral-500">Leave blank to use the auto-generated YouTube thumbnail if a link is provided.</p>
                    </div>

                    {/* Live URL */}
                    <div>
                        <label htmlFor="liveUrl" className="block text-sm font-semibold mb-2 text-neutral-300">Live Site URL (Optional)</label>
                        <input
                            id="liveUrl" name="liveUrl" type="url"
                            placeholder="https://example.com"
                            disabled={isSubmitting}
                            className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
                        />
                    </div>

                     {/* GitHub URL */}
                    <div>
                        <label htmlFor="githubUrl" className="block text-sm font-semibold mb-2 text-neutral-300">GitHub Repo URL (Optional)</label>
                        <input
                            id="githubUrl" name="githubUrl" type="url"
                            placeholder="https://github.com/user/repo"
                            disabled={isSubmitting}
                            className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || categories.length === 0}
                        className="w-full inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:text-neutral-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                    >
                        {isSubmitting ? (
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