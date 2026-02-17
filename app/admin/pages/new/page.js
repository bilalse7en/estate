'use client';

import AdminCard from '@/components/admin/AdminCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import { Loader2, Save, ArrowLeft } from 'lucide-react';

// Dynamically import Editor.js (client-side only)
const EditorJSComponent = dynamic(() => import('@/components/admin/EditorJSComponent'), {
  ssr: false,
  loading: () => (
    <div className="admin-card p-12 bg-[var(--bg-secondary)] min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--color-gold)]" />
    </div>
  ),
});

export default function NewPagePage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState({ blocks: [] });
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

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
      addToast('Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      const pageId = `page_${slug}`;
      const { error } = await supabase.from('site_settings').upsert({
        id: pageId,
        content: {
          title,
          published,
          updated_at: new Date().toISOString(),
          blocks: content.blocks
        }
      });

      if (error) throw error;

      addToast('Corporate page initialized successfully!', 'success');
      router.push('/admin/pages');
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error creating page:', error);
      addToast('Error creating page: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-500 mb-1 transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Return to Inventory</span>
          </button>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Initialize Enterprise Page</h1>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => router.back()} className="btn-glass text-xs">Discard</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-premium space-x-2"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{published ? 'Launch Page' : 'Save Setup'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Page Architecture">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Corporate Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Privacy Policy"
                  className="admin-input font-bold"
                  required
                />
              </div>
              <div>
                <label className="admin-label">Primary Narrative Content *</label>
                <EditorJSComponent
                  data={content}
                  onChange={setContent}
                  editorblock="editorjs-new-page"
                />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Routing Settings">
            <div className="space-y-4">
              <div>
                <label className="admin-label">System Slug *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="admin-input font-mono text-[10px]"
                  required
                />
                <p className="text-[9px] text-[var(--text-muted)] mt-1">Preview: /page/{slug || '...'}</p>
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
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                    Live System Visibility
                  </span>
                </label>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="SEO AI Content Status">
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Every enterprise page is optimized for search engines using semantic HTML5 and premium metadata configurations.
            </p>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
