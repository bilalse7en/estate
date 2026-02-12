'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { uploadMedia } from '@/lib/actions/media-actions';

export default function MediaUploader({ onUploadSuccess, accept = 'image/*' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileInput = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadMedia(formData);

    setUploading(false);

    if (result.error) {
      setError(result.error);
      setPreview(null);
    } else {
      setSuccess(true);
      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }
      // Clear after 2 seconds
      setTimeout(() => {
        setPreview(null);
        setSuccess(false);
      }, 2000);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary-500 bg-primary-500/5'
              : 'border-[var(--glass-border)] hover:border-primary-500/50 hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-main)] mb-1">
                Drop image here or click to upload
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Supports: JPG, PNG, GIF, WebP (Max 5MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative glass p-4 rounded-2xl border border-[var(--glass-border)]">
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--bg-secondary)] flex-shrink-0">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              {uploading && (
                <div className="flex items-center space-x-2 text-primary-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload successful!</span>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
