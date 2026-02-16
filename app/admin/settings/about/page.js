'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminCard from '@/components/admin/AdminCard';
import { Save, Image as ImageIcon, ArrowLeft, Loader2, Globe, Zap, BarChart, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function AboutSettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState({
    title: "",
    subtitle: "",
    image: "",
    stats: [],
    points: []
  });

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
      if (data?.content?.about) {
        setAbout(data.content.about);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: current } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
      const updatedContent = { ...(current?.content || {}), about };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'homepage', content: updatedContent });
      
      if (error) throw error;
      addToast('Executive biography synchronized', 'success');
    } catch (error) {
      addToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--color-gold)]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button onClick={() => router.push('/admin/settings')} className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-500 mb-2 transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Return to Terminal</span>
          </button>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Executive Biography</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-premium space-x-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Commit Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Strategic Narrative">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Legacy Headline</label>
                <input
                  type="text"
                  value={about.title}
                  onChange={(e) => setAbout({...about, title: e.target.value})}
                  className="admin-input font-bold"
                />
              </div>
              <div>
                <label className="admin-label">Detailed Biography</label>
                <textarea
                  value={about.subtitle}
                  onChange={(e) => setAbout({...about, subtitle: e.target.value})}
                  className="admin-input h-64 resize-none leading-relaxed"
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Performance Indicators">
            <div className="grid grid-cols-2 gap-4">
              {about.stats?.map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)]">
                  <label className="admin-label">{stat.label}</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const next = [...about.stats];
                      next[i].value = e.target.value;
                      setAbout({...about, stats: next});
                    }}
                    className="admin-input"
                  />
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Visual Identification">
            <label className="admin-label">Portrait Representation</label>
            <div className="relative mb-4">
              <input
                type="text"
                value={about.image}
                onChange={(e) => setAbout({...about, image: e.target.value})}
                className="admin-input pl-10 text-[10px]"
              />
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gold)] opacity-50" />
            </div>
            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] shadow-xl">
              {about.image && <img src={about.image} className="w-full h-full object-cover" alt="Persona" />}
            </div>
          </AdminCard>
          
          <AdminCard title="Strategic Pillars">
            <div className="space-y-2">
              {about.points?.map((point, i) => (
                <div key={i} className="flex space-x-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => {
                      const next = [...about.points];
                      next[i] = e.target.value;
                      setAbout({...about, points: next});
                    }}
                    className="admin-input py-2 text-xs"
                  />
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
