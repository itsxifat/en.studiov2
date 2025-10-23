"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertTriangle, Loader2, Image as ImageIcon, X } from 'lucide-react';

// Reusable Message component
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
      className={`flex items-center gap-3 p-4 rounded-lg border ${style[status]} mb-6`}
    >
      <Icon size={20} className={status === 'loading' ? 'animate-spin' : ''} />
      <p className="font-semibold">{message}</p>
    </motion.div>
  );
};

export default function UploadPhotographyPage() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setStatus('error');
        setMessage('File is too large (Max 10MB).');
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus(null);
      setMessage('');
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !file) {
      if (!file) {
        setStatus('error');
        setMessage('Please select a file to upload.');
      }
      return;
    }

    setIsSubmitting(true);
    setStatus('loading');
    setMessage('Uploading photo to Cloudinary...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', e.target.title.value);
    formData.append('description', e.target.description.value);

    try {
      const res = await fetch('/api/admin/photography/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage('Photo uploaded successfully!');
        e.target.reset();
        clearFile();
      } else {
        setStatus('error');
        setMessage(`Error: ${data.error || 'Upload failed.'}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Network Error: ${error.message || 'Failed to submit.'}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-heading uppercase text-cyan-400">
        Upload Photography
      </h1>

      <AnimatePresence>{status && <Message status={status} message={message} key="message" />}</AnimatePresence>

      <div className="bg-neutral-900/70 border border-neutral-700/50 p-8 rounded-xl shadow-lg mt-8 backdrop-blur-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-300">Photo *</label>
            <div 
              className={`flex justify-center items-center w-full h-64 px-6 pt-5 pb-6 border-2 border-neutral-700 border-dashed rounded-lg cursor-pointer hover:border-cyan-500 transition-colors ${preview ? 'p-0' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} alt="Preview" className="object-contain w-full h-full rounded-md" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent re-opening file dialog
                      clearFile();
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-neutral-500" />
                  <p className="text-sm text-neutral-400">
                    <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif, image/webp"
              disabled={isSubmitting}
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold mb-2 text-neutral-300">Title</label>
            <input
              id="title" name="title" type="text" maxLength={100}
              disabled={isSubmitting}
              className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
              placeholder="e.g. 'Sunset Over the Lake' (Optional)"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold mb-2 text-neutral-300">Description</label>
            <textarea
              id="description" name="description" rows={3}
              disabled={isSubmitting}
              className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition text-white placeholder-neutral-500 disabled:opacity-50"
              placeholder="A brief description of the photo (Optional)"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !file}
            className="w-full inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:text-neutral-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} className="mr-2" />
                Upload Photo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}