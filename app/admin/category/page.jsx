"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, List, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

const API_ROUTE = '/api/admin/category';

export default function AdminCategoryPage() {
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
    const [message, setMessage] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [fetchLoading, setFetchLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        setFetchLoading(true);
        try {
            const res = await fetch(API_ROUTE);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                // Filter out the 'All' category which is only for frontend display
                setCategories(data.data.filter(c => c.name !== 'All'));
            } else {
                setMessage(data.error || 'Failed to load categories.');
                setStatus('error');
            }
        } catch (error) {
            setMessage('Failed to connect to the category API.');
            setStatus('error');
        } finally {
            setFetchLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('Adding category...');

        try {
            const res = await fetch(API_ROUTE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName.trim() }),
            });

            const data = await res.json();
            
            if (data.success) {
                setStatus('success');
                setMessage(`Category "${data.data.name}" added!`);
                setCategoryName('');
                fetchCategories(); // Re-fetch to update the list
            } else {
                setStatus('error');
                setMessage(`Error: ${data.error || 'Failed to add category.'}`);
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error during submission.');
        }

        setTimeout(() => setStatus(null), 5000);
    };

    const handleCategoryDelete = async (category) => {
        if (!confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
            return;
        }

        setStatus('loading');
        setMessage(`Deleting category "${category.name}"...`);

        try {
            const res = await fetch(`${API_ROUTE}/${category._id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setMessage(`Category "${category.name}" deleted successfully.`);
                fetchCategories();
            } else {
                 if (data.code === 'IN_USE') {
                    // Specific error if category is in use
                    setStatus('error');
                    setMessage(data.error);
                } else {
                    setStatus('error');
                    setMessage(`Error: ${data.error || 'Failed to delete category.'}`);
                }
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error during deletion.');
        }

        setTimeout(() => setStatus(null), 7000);
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
        <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-heading uppercase text-cyan-400">
                Manage Portfolio Categories
            </h1>

            <AnimatePresence>{status && <Message status={status} message={message} key="message" />}</AnimatePresence>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Add New Category Form */}
                <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6 rounded-xl shadow-2xl h-fit">
                    <h2 className="text-2xl font-bold mb-4 font-heading text-white flex items-center gap-2">
                        <Plus size={20} className='text-cyan-400'/> Add New Category
                    </h2>
                    <form className="space-y-4" onSubmit={handleCategorySubmit}>
                        <div>
                            <label htmlFor="categoryName" className="block text-sm font-semibold mb-2 text-neutral-300">Category Name</label>
                            <input 
                                id="categoryName" 
                                name="categoryName" 
                                type="text" 
                                required 
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                disabled={status === 'loading'}
                                className="w-full font-body bg-neutral-800 border-2 border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-white placeholder-neutral-500"
                                placeholder="e.g. Corporate Films"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={status === 'loading'}
                            className="w-full inline-flex items-center justify-center brutalist-button bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:text-neutral-400"
                        > 
                            Add Category
                        </button>
                    </form>
                </div>

                {/* Existing Categories List */}
                <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6 rounded-xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4 font-heading text-white flex items-center gap-2">
                        <List size={20} className='text-cyan-400'/> Existing Categories ({categories.length})
                    </h2>
                    {fetchLoading ? (
                        <div className="text-center py-4">
                            <Loader2 size={24} className="animate-spin text-cyan-400 mx-auto" />
                            <p className="text-neutral-400 text-sm mt-2">Loading...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <p className="text-neutral-500 italic text-center py-4">No categories added yet.</p>
                    ) : (
                        <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {categories.map((cat) => (
                                <li key={cat._id} className="flex justify-between items-center bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                                    <span className="text-neutral-200 font-medium">{cat.name}</span>
                                    <button
                                        onClick={() => handleCategoryDelete(cat)}
                                        className="text-red-400 hover:text-red-500 p-1 rounded-full hover:bg-red-900/50 transition-colors"
                                        aria-label={`Delete category ${cat.name}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}