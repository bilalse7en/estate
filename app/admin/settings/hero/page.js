'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminCard from '@/components/admin/AdminCard';
import { Save, Image as ImageIcon, Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function HeroSettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    // Timeout to prevent stuck loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    async function loadSettings() {
      try {
        const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
        if (data?.content?.hero_slides) {
          setSlides(data.content.hero_slides);
        } else {
          setSlides([{ title: "", subtitle: "", image: "" }]);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error loading hero settings:', error);
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    }
    loadSettings();

    return () => clearTimeout(timeout);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: current } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
      const updatedContent = { ...(current?.content || {}), hero_slides: slides };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'homepage', content: updatedContent });
      
      if (error) throw error;
      addToast('Hero slides synchronized successfully', 'success');
    } catch (error) {
      addToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="py-20 flex justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-[var(--color-gold)]" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => router.push('/admin/settings')}
            className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-500 mb-2 transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Return to Terminal</span>
          </button>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Hero Showcase Engine</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-premium space-x-2"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Commit Changes</span>
        </button>
      </div>

      <AdminCard 
        title="Visual Asset Sequence"
        actions={
          <button 
            onClick={() => setSlides([...slides, {title:"", subtitle:"", image:""}])}
            className="btn-glass px-3 py-1 text-[9px]"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Slide
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide, index) => (
            <div key={index} className="p-6 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] space-y-4 relative group hover:border-[var(--color-gold)]/30 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-[0.2em]">Sequence Item #{index+1}</span>
                {slides.length > 1 && (
                  <button 
                    onClick={() => setSlides(slides.filter((_, i) => i !== index))}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="admin-label">Strategic Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => {
                      const next = [...slides];
                      next[index].title = e.target.value;
                      setSlides(next);
                    }}
                    placeholder="Enter hero title..."
                    className="admin-input font-bold"
                  />
                </div>
                <div>
                  <label className="admin-label">Narrative Subtitle</label>
                  <textarea
                    value={slide.subtitle}
                    onChange={(e) => {
                      const next = [...slides];
                      next[index].subtitle = e.target.value;
                      setSlides(next);
                    }}
                    placeholder="Enter supporting text..."
                    className="admin-input h-20 resize-none text-xs"
                  />
                </div>
                <div>
                  <label className="admin-label">Background Representation (Image URL)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={slide.image}
                      onChange={(e) => {
                        const next = [...slides];
                        next[index].image = e.target.value;
                        setSlides(next);
                      }}
                      className="admin-input pl-10 text-[10px] font-mono"
                    />
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gold)] opacity-50" />
                  </div>
                </div>
                
                {slide.image && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--border-subtle)] mt-2">
                    <img src={slide.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
