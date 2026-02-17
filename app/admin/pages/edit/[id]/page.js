'use client';

import AdminCard from '@/components/admin/AdminCard';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import { Loader2, Save, ArrowLeft, Trash2, Plus, Award as AwardIcon, Sparkles } from 'lucide-react';

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
  const [slug, setSlug] = useState(slugFromParams || '');
  const [content, setContent] = useState({ blocks: [] });
  const [specialData, setSpecialData] = useState({
    expertise: [],
    certifications: []
  });
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    
    // Safety Force Render: After 5 seconds, stop loading even if DB is slow
    const safetyTimeout = setTimeout(() => {
      if (active && loading) setLoading(false);
    }, 5000);

    async function loadPage() {
      try {
        if (!slugFromParams) return;
        
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', `page_${slugFromParams}`)
          .maybeSingle();

        if (!active) return;
        if (error) throw error;

        if (data && data.content) {
          setTitle(data.content.title || '');
          setContent(data.content.blocks ? { blocks: data.content.blocks } : { blocks: [] });
          setPublished(data.content.published !== false);
          
          // Load special data if it exists (for portfolio)
          if (slugFromParams === 'portfolio') {
            setSpecialData({
              expertise: data.content.expertise || [],
              certifications: data.content.certifications || [],
              cta: data.content.cta || {
                primaryText: "Connect Now",
                primaryLink: "#contact",
                emailText: "Email Consultation",
                emailLink: "mailto:info@ahmedkapadia.com",
                callText: "Schedule Call",
                callLink: "/contact"
              }
            });
          }
        } else {
          // If page doesn't exist, use the slug as a default title
          setTitle(slugFromParams.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
          // Default data for new portfolio page
          if (slugFromParams === 'portfolio') {
            setSpecialData({
              expertise: [],
              certifications: [],
              cta: {
                primaryText: "Connect Now",
                primaryLink: "#contact",
                emailText: "Email Consultation",
                emailLink: "mailto:info@ahmedkapadia.com",
                callText: "Schedule Call",
                callLink: "/contact"
              }
            });
          }
        }
      } catch (error) {
        const isAbort = error.name === 'AbortError' || error.message?.includes('AbortError') || error.message?.includes('aborted');
        if (isAbort) return;
        
        console.error('Core page sync failure:', error);
        addToast('System Sync Latency - Defaulting to local buffer', 'error');
      } finally {
        if (active) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    }

    loadPage();
    return () => { 
      active = false;
      clearTimeout(safetyTimeout);
    };
  }, [slugFromParams]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !slug) {
      addToast('Please fill in required fields', 'error');
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
            blocks: content.blocks,
            ...(slug === 'portfolio' ? specialData : {})
          }
        });

      if (error) throw error;
      addToast('Corporate page updated successfully!', 'success');
      router.push('/admin/pages');
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error updating page:', error);
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
                <label className="admin-label">Strategic Narrative</label>
                <div className="mb-2">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Block Editor Interface</p>
                </div>
                <EditorJSComponent
                  data={content}
                  onChange={setContent}
                  editorblock={`editorjs-edit-page-${slug}`}
                />
              </div>
            </div>
          </AdminCard>

          {/* Specialized Fields for Portfolio */}
          {slug === 'portfolio' && (
            <div className="space-y-6">
              <AdminCard 
                title="Areas of Expertise" 
                actions={
                  <button 
                    onClick={() => setSpecialData({...specialData, expertise: [...specialData.expertise, {title: "", description: ""}]})}
                    className="btn-glass px-3 py-1 text-[9px]"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Expertise
                  </button>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specialData.expertise?.map((exp, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] relative group">
                      <div className="space-y-3 pr-8">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const next = [...specialData.expertise];
                            next[i].title = e.target.value;
                            setSpecialData({...specialData, expertise: next});
                          }}
                          className="admin-input font-bold text-sm !py-1.5"
                          placeholder="Expertise Title"
                        />
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const next = [...specialData.expertise];
                            next[i].description = e.target.value;
                            setSpecialData({...specialData, expertise: next});
                          }}
                          className="admin-input text-[11px] h-16 resize-none"
                          placeholder="Brief description..."
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const next = specialData.expertise.filter((_, idx) => idx !== i);
                          setSpecialData({...specialData, expertise: next});
                        }}
                        className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </AdminCard>

              <AdminCard 
                title="Certifications & Awards"
                actions={
                  <button 
                    onClick={() => setSpecialData({...specialData, certifications: [...specialData.certifications, {title: "", year: ""}]})}
                    className="btn-glass px-3 py-1 text-[9px]"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Recognition
                  </button>
                }
              >
                <div className="space-y-3">
                  {specialData.certifications?.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] group">
                      <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                        <AwardIcon className="w-4 h-4 text-primary-500" />
                      </div>
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const next = [...specialData.certifications];
                          next[i].title = e.target.value;
                          setSpecialData({...specialData, certifications: next});
                        }}
                        className="admin-input !py-1 flex-1 text-sm font-bold"
                        placeholder="Award Name"
                      />
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => {
                          const next = [...specialData.certifications];
                          next[i].year = e.target.value;
                          setSpecialData({...specialData, certifications: next});
                        }}
                        className="admin-input !py-1 w-24 text-center font-mono text-[11px]"
                        placeholder="Year"
                      />
                      <button 
                        onClick={() => {
                          const next = specialData.certifications.filter((_, idx) => idx !== i);
                          setSpecialData({...specialData, certifications: next});
                        }}
                        className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </AdminCard>

              <AdminCard title="Strategic Call to Action">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="admin-label">Primary Button Text</label>
                      <input
                        type="text"
                        value={specialData.cta?.primaryText}
                        onChange={(e) => setSpecialData({...specialData, cta: {...specialData.cta, primaryText: e.target.value}})}
                        className="admin-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Primary Button Link</label>
                      <input
                        type="text"
                        value={specialData.cta?.primaryLink}
                        onChange={(e) => setSpecialData({...specialData, cta: {...specialData.cta, primaryLink: e.target.value}})}
                        className="admin-input font-mono text-[10px]"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--border-subtle)]">
                    <div>
                      <label className="admin-label">Email Button Text</label>
                      <input
                        type="text"
                        value={specialData.cta?.emailText}
                        onChange={(e) => setSpecialData({...specialData, cta: {...specialData.cta, emailText: e.target.value}})}
                        className="admin-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Email Button Link (mailto:)</label>
                      <input
                        type="text"
                        value={specialData.cta?.emailLink}
                        onChange={(e) => setSpecialData({...specialData, cta: {...specialData.cta, emailLink: e.target.value}})}
                        className="admin-input font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--border-subtle)]">
                    <div>
                      <label className="admin-label">Call Button Text</label>
                      <input
                        type="text"
                        value={specialData.cta?.callText}
                        onChange={(e) => setSpecialData({...specialData, cta: {...specialData.cta, callText: e.target.value}})}
                        className="admin-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Call Button Link (phone/contact)</label>
                      <input
                        type="text"
                        value={specialData.cta?.callLink}
                        onChange={(e) => setSpecialData({...specialData, cta: {...specialData.cta, callLink: e.target.value}})}
                        className="admin-input font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </AdminCard>
            </div>
          )}
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
