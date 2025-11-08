"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, LogIn, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // On success, redirect to the admin dashboard
        // The middleware will now let us pass
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Login failed.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Image 
          src="/logo.png" 
          alt="En.Studio Logo" 
          width={80} 
          height={80}
          className="mx-auto h-20 w-auto"
          unoptimized
        />
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight font-heading uppercase text-cyan-400">
          Admin Access
        </h1>
        <p className="mt-2 text-center text-sm text-neutral-400">
          Enter the password to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500"
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <LogIn size={20} className="mr-2" />
            )}
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}