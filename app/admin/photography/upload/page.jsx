"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertTriangle, Loader2, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';


// Reusable Message component
const Message = ({ status, message }) => {
  if (!status) return null;
  const style = {
    success: 'bg-green-800 border-green-700 text-green-200',
    error: 'bg-red-800 border-red-700 text-red-200',
    loading: 'bg-cyan-800 border-cyan-700 text-cyan-200',
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

  // --- New state for projects ---
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fetch projects for the dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const res = await fetch('/api/admin/photo-projects');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
          if (data.data.length > 0) {
            setSelectedProject(data.data[0]._id); // Default to first project
          }
        } else {
          console.error("Failed to load projects:", data.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);
  
  // --- End new state logic ---

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) { // 20MB limit
        setStatus('error');
        setMessage('File is too large (Max 20MB).');
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus(null); setMessage('');
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !file || !selectedProject) {
      setStatus('error');
      setMessage('Please select a project and a file to upload.');
      return;
    }

    setIsSubmitting(true);
    setStatus('loading');
    setMessage('Uploading photo to Cloudinary...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', selectedProject); // Add project ID
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
        setMessage('Photo uploaded and linked to project!');
        e.target.reset(); // Clear text fields
        clearFile(); // Clear file input
      } else {
        throw new Error(data.error || 'Upload failed.');
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
        Upload Project Photo
      </h1>

      <AnimatePresence>{status && <Message status={status} message={message} key="message" />}</AnimatePresence>

      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl shadow-lg mt-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* --- Project Selector --- */}
          <div>
            <label htmlFor="projectId" className="block text-sm font-semibold mb-2 text-neutral-300">Link to Project *</label>
            <select
              id="projectId"
              name="projectId"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              required
              disabled={isSubmitting || isLoadingProjects}
              className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="" disabled>
                {isLoadingProjects ? 'Loading projects...' : 'Select a project'}
              </option>
              {projects.map(proj => (
                <option key={proj._id} value={proj._id}>{proj.title}</option>
              ))}
            </select>
            {projects.length === 0 && !isLoadingProjects && (
                 <p className="text-xs mt-1 text-yellow-400">
                    No projects found. Please <Link href="/admin/photography/projects" className="underline hover:text-cyan-400">create a project</Link> first.
                 </p>
            )}
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-300">Photo *</label>
            {/* ... (File upload JSX - no changes) ... */}
            <div 
              className={`flex justify-center items-center w-full h-64 px-6 pt-5 pb-6 border-2 border-neutral-700 border-dashed rounded-lg cursor-pointer hover:border-cyan-500 transition-colors ${preview ? 'p-0' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} alt="Preview" className="object-contain w-full h-full rounded-md" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-neutral-500" />
                  <p className="text-sm text-neutral-400"><span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-neutral-500">PNG, JPG, WebP up to 20MB</p>
                </div>
              )}
            </div>
            <input
              id="file-upload" name="file-upload" type="file" className="sr-only"
              ref={fileInputRef} onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif, image/webp"
              disabled={isSubmitting}
            />
          </div>

          {/* Title & Description (Optional) */}
          <input name="title" type="text" disabled={isSubmitting} className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500" placeholder="Photo Title (Optional)" />
          <textarea name="description" rows={3} disabled={isSubmitting} className="w-full font-body bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500" placeholder="Photo Description (Optional)" />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !file || !selectedProject || isLoadingProjects}
            className="w-full inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-5 py-3 rounded-lg transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} className="mr-2" />}
            Upload Photo
          </button>
        </form>
      </div>
    </div>
  );
}