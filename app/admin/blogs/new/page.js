'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import { Loader2, Save, Eye, ArrowLeft } from 'lucide-react';

// Dynamically import Editor.js (client-side only)
const EditorJSComponent = dynamic(() => import('@/components/admin/EditorJSComponent'), {
  ssr: false,
  loading: () => (
    <div className="border border-[var(--glass-border)] rounded-2xl p-8 bg-[var(--bg-secondary)] min-h-[500px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  ),
});

export default function NewBlogPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [content, setContent] = useState({ blocks: [] });
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  }, [title]);

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        setFeaturedImage(data.url);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!title || !slug || !content.blocks || content.blocks.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('blogs').insert([
        {
          title,
          slug,
          excerpt: excerpt || null,
          content: content,
          featured_image: featuredImage || null,
          published,
        },
      ]);

      if (error) throw error;

      alert('Blog created successfully!');
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Access Denied</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Blogs</span>
          </button>
          <h1 className="text-4xl font-display font-bold text-[var(--text-main)]">Create New Blog Post</h1>
          <p className="text-[var(--text-muted)] mt-2">Write and publish your blog content with Editor.js</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Title */}
          <div className="glass p-6 rounded-2xl">
            <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wider">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title..."
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-primary-500 transition-colors"
              required
            />
          </div>

          {/* Slug */}
          <div className="glass p-6 rounded-2xl">
            <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wider">
              URL Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-friendly-slug"
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-primary-500 transition-colors font-mono text-sm"
              required
            />
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Preview: /blog/{slug || 'your-slug-here'}
            </p>
          </div>

          {/* Excerpt */}
          <div className="glass p-6 rounded-2xl">
            <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wider">
              Excerpt (Optional)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of your blog post..."
              rows={3}
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>

          {/* Featured Image */}
          <div className="glass p-6 rounded-2xl">
            <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wider">
              Featured Image (Optional)
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
                className="w-full text-sm text-[var(--text-main)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600 file:cursor-pointer"
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <div className="flex items-center space-x-2 text-primary-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              )}
              {featuredImage && (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Editor.js Content */}
          <div>
            <label className="block text-sm font-bold text-[var(--text-main)] mb-4 uppercase tracking-wider">
              Content *
            </label>
            <EditorJSComponent
              data={content}
              onChange={setContent}
              editorblock="editorjs-new-blog"
            />
          </div>

          {/* Publish Toggle */}
          <div className="glass p-6 rounded-2xl">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 rounded border-[var(--glass-border)] text-primary-500 focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-[var(--text-main)] font-medium">
                Publish immediately
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-[var(--glass-border)] text-[var(--text-main)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-premium px-8 py-3 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{published ? 'Publish' : 'Save Draft'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
