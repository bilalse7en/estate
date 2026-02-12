'use client';

import AdminCard from '@/components/admin/AdminCard';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import { Loader2, Save, Eye, ArrowLeft } from 'lucide-react';
import MediaUploader from '@/components/admin/MediaUploader';

// Dynamically import Editor.js (client-side only)
const EditorJSComponent = dynamic(() => import('@/components/admin/EditorJSComponent'), {
  ssr: false,
  loading: () => (
    <div className="admin-card p-12 bg-[var(--bg-secondary)] min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--color-gold)]" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-500 mb-1 transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Return to Inventory</span>
          </button>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Initialize Publication</h1>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-glass text-xs"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-premium space-x-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{published ? 'Publish Now' : 'Save Draft'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content Area */}
          <AdminCard title="Primary Content Engine">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Publication Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a professional title..."
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label className="admin-label">Journal Content *</label>
                <EditorJSComponent
                  data={content}
                  onChange={setContent}
                  editorblock="editorjs-new-blog"
                />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          {/* Metadata & Media Sidepanel */}
          <AdminCard title="Distribution Settings">
            <div className="space-y-4">
              <div>
                <label className="admin-label">URL Routing Slug *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="admin-input font-mono text-[10px]"
                  required
                />
                <p className="text-[9px] text-[var(--text-muted)] mt-1 font-medium">
                  Preview: /blog/{slug || '...'}
                </p>
              </div>
              
              <div>
                <label className="admin-label">Brief Abstract (Excerpt)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary for SEO and listings..."
                  rows={4}
                  className="admin-input resize-none h-24"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-full peer peer-checked:bg-[var(--color-gold)] transition-all"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:left-6"></div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">
                    Public Visibility
                  </span>
                </label>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Visual Assets">
            <div className="space-y-4">
              <label className="admin-label">Cover Representation</label>
              <MediaUploader 
                onUploadSuccess={(media) => setFeaturedImage(media.public_url)} 
              />
              {featuredImage && (
                <div className="relative group rounded-lg overflow-hidden border border-[var(--border-subtle)]">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full aspect-video object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[10px] uppercase tracking-widest"
                  >
                    Remove Asset
                  </button>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
