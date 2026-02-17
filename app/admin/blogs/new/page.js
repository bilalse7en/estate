'use client';

import AdminCard from '@/components/admin/AdminCard';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import { Loader2, Save, Eye, ArrowLeft, Sparkles, X, Wand2 } from 'lucide-react';
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
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [content, setContent] = useState({ blocks: [] });
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // AI Generator States
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const editorRef = useRef(null);

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

  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) {
      addToast('Please enter a topic for AI generation', 'error');
      return;
    }

    setGenerating(true);
    setGenerationProgress('Initializing AI content engine...');

    try {
      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          keywords: aiKeywords.split(',').map(k => k.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'AI generation failed');
      }

      const generatedBlog = data.blog;
      console.log('Generated blog data:', generatedBlog);

      // Simulate streaming effect by updating content progressively
      setGenerationProgress('Structuring content blocks...');
      
      // Auto-fill form fields immediately
      setTitle(generatedBlog.title);
      setExcerpt(generatedBlog.excerpt || generatedBlog.metaDescription);
      
      setGenerationProgress('Populating editor with AI-generated content...');
      
      // Update content with proper Editor.js format
      // Make sure content has the blocks array
      const editorContent = generatedBlog.content && generatedBlog.content.blocks 
        ? generatedBlog.content 
        : { blocks: [] };
      
      console.log('Setting content:', editorContent);
      
      // Update content immediately
      setContent(editorContent);
      
      // Small delay for completion message
      setTimeout(() => {
        setGenerationProgress('Content generation complete!');
        
        setTimeout(() => {
          setShowAIModal(false);
          setAiTopic('');
          setAiKeywords('');
          setGenerating(false);
          setGenerationProgress('');
          addToast('AI blog generated successfully! Review and publish when ready.', 'success');
        }, 1000);
      }, 500);

    } catch (err) {
      setGenerationProgress('');
      setGenerating(false);
      addToast('AI Generation Error: ' + err.message, 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !slug || !content.blocks || content.blocks.length === 0) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
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

      addToast('Blog created successfully!', 'success');
      router.push('/admin/blogs');
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error creating blog:', error);
      addToast('Error creating blog: ' + error.message, 'error');
    } finally {
      setSaving(false);
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
    <>
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
              disabled={saving}
              className="btn-premium space-x-2"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{published ? 'Publish Now' : 'Save Draft'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Generator Button */}
            <button
              onClick={() => setShowAIModal(true)}
              className="w-full glass p-4 rounded-2xl border-2 border-dashed border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/5 transition-all group"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--color-gold)] transition-colors">
                    Generate Blog with AI
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    Free • Powered by Google Gemini • SEO-Optimized
                  </div>
                </div>
              </div>
            </button>

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
                    key={JSON.stringify(content)}
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

      {/* AI Generator Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass max-w-lg w-full rounded-3xl border border-[var(--glass-border)] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">AI Blog Generator</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">Free • SEO-Optimized • Professional Content</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!generating) {
                    setShowAIModal(false);
                    setAiTopic('');
                    setAiKeywords('');
                  }
                }}
                disabled={generating}
                className="w-8 h-8 rounded-lg hover:bg-[var(--hover-bg)] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {generationProgress && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs flex items-center space-x-3">
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span>{generationProgress}</span>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-2 block">
                  Blog Topic *
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g., Top 10 Luxury Properties in Dubai Marina 2026"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/40 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                  disabled={generating}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-2 block">
                  Keywords (Optional)
                </label>
                <input
                  type="text"
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  placeholder="luxury homes, Dubai Marina, investment (comma separated)"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/40 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                  disabled={generating}
                />
              </div>

              <button
                onClick={handleAIGenerate}
                disabled={generating || !aiTopic.trim()}
                className="w-full btn-premium py-4 flex items-center justify-center space-x-2 text-sm mt-6"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Professional Content...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate SEO-Optimized Blog</span>
                  </>
                )}
              </button>

              <p className="text-[9px] text-[var(--text-muted)] italic text-center mt-4">
                AI generates 1200-1500 word SEO-optimized content in Editor.js format with proper HTML structure
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
