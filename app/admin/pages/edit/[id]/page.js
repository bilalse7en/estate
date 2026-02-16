'use client';

import AdminCard from '@/components/admin/AdminCard';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import { Loader2, Save, ArrowLeft, Trash2 } from 'lucide-react';

const EditorJSComponent = dynamic(() => import('@/components/admin/EditorJSComponent'), {
  ssr: false,
  loading: () => (
    <div className="admin-card p-12 bg-[var(--bg-secondary)] min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--color-gold)]" />
    </div>
  ),
});

export default function EditPagePage({ params }) {
  const unwrappedParams = use(params);
  const slugFromParams = unwrappedParams.id;
  
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState({ blocks: [] });
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPage() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', `page_${slugFromParams}`)
          .maybeSingle();

        if (error) throw error;

        if (data && data.content) {
          setTitle(data.content.title);
          setSlug(slugFromParams);
          setContent({ blocks: data.content.blocks || [] });
          setPublished(data.content.published !== false);
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Error loading page:', error);
        addToast('Error loading page', 'error');
        router.push('/admin/pages');
      } finally {
        setLoading(false);
      }
    }

    if (slugFromParams) {
      loadPage();
    }
  }, [slugFromParams, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !slug || !content.blocks || content.blocks.length === 0) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: `page_${slug}`,
          content: {
            title,
            published,
            updated_at: new Date().toISOString(),
            blocks: content.blocks
          }
        });

      if (error) throw error;
      addToast('Corporate page updated successfully!', 'success');
      router.push('/admin/pages');
    } catch (error) {
      addToast('Error updating page: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return null;
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  );

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
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Synchronize Corporate Page</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-premium space-x-2"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Commit Update</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Primary Content Engine">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Corporate Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-input font-bold"
                  required
                />
              </div>
              <div>
                <label className="admin-label">Strategic Narrative *</label>
                <EditorJSComponent
                  data={content}
                  onChange={setContent}
                  editorblock={`editorjs-edit-page-${slug}`}
                />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Routing Settings">
            <div className="space-y-4">
              <div>
                <label className="admin-label">System Slug (ReadOnly)</label>
                <input
                  type="text"
                  value={slug}
                  disabled
                  className="admin-input font-mono text-[10px] opacity-60 bg-[var(--bg-tertiary)]"
                />
                <p className="text-[9px] text-[var(--text-muted)] mt-1">Status: Operational</p>
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
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                    Live System Visibility
                  </span>
                </label>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
