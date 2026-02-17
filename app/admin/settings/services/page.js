'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminCard from '@/components/admin/AdminCard';
import { Save, ArrowLeft, Loader2, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function ServicesSettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    title: "BEYOND THE CONVENTIONAL",
    subtitle: "We define a new standard in real estate consulting, where every detail is managed with surgical precision.",
    service_items: [
      { title: 'Investment Advisory', description: 'Data-driven insights to maximize your portfolio growth in the UAE market.', icon: 'LineChart' },
      { title: 'Property Acquisition', description: 'Exclusive access to off-market properties and early developer releases.', icon: 'Home' },
      { title: 'Portfolio Management', description: 'End-to-end management services for domestic and international investors.', icon: 'ShieldCheck' },
      { title: 'Corporate Services', description: 'Strategic real estate solutions for businesses and institutional entities.', icon: 'Briefcase' }
    ],
    stats: [
      { label: "Market Access", value: "Unlimited", prefix: "", suffix: "", icon: 'Globe' },
      { label: "Client Satisfaction", value: "100", prefix: "", suffix: "%", icon: 'Zap' },
      { label: "Asset Valuation", value: "2", prefix: "$", suffix: "B+", icon: 'LineChart' },
      { label: "Acquisition Time", value: "10", prefix: "", suffix: " Days", icon: 'Sparkles' }
    ]
  });

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    async function loadSettings() {
      try {
        const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
        if (data?.content?.services) {
          setSettings({
            ...settings,
            ...data.content.services
          });
        }
      } catch (error) {
        if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
        console.error('Error loading services settings:', error);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    }
    loadSettings();
    return () => clearTimeout(timeout);
  }, []);

  const handleSave = async () => {
    const timeoutId = setTimeout(() => {
      setSaving(false);
      addToast('Save timeout - please try again', 'error');
    }, 5000);

    setSaving(true);
    try {
      const { data: current } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
      const updatedContent = { ...(current?.content || {}), services: settings };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'homepage', content: updatedContent });
      
      if (error) throw error;
      addToast('Service suite synchronized', 'success');
    } catch (error) {
      if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
      addToast('Error saving settings', 'error');
    } finally {
      clearTimeout(timeoutId);
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--color-gold)]" /></div>;

  const updateItem = (index, field, value) => {
    const newList = [...settings.service_items];
    newList[index] = { ...newList[index], [field]: value };
    setSettings({ ...settings, service_items: newList });
  };

  const updateStat = (index, field, value) => {
    const newList = [...settings.stats];
    newList[index] = { ...newList[index], [field]: value };
    setSettings({ ...settings, stats: newList });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button onClick={() => router.push('/admin/settings')} className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-500 mb-2 transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Return to Terminal</span>
          </button>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Strategic Service Suite</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-premium space-x-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Commit Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Operational Framework">
          <div className="space-y-4">
            <div>
              <label className="admin-label">Service Master Headline</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings({...settings, title: e.target.value})}
                className="admin-input font-bold"
              />
            </div>
            <div>
              <label className="admin-label">Service Philosophy Narrative</label>
              <textarea
                value={settings.subtitle}
                onChange={(e) => setSettings({...settings, subtitle: e.target.value})}
                className="admin-input h-32 resize-none"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Global Performance Metrics">
          <div className="grid grid-cols-2 gap-4">
            {settings.stats.map((stat, i) => (
              <div key={i} className="p-4 bg-[var(--bg-tertiary)]/30 rounded-2xl border border-[var(--border-subtle)] space-y-3">
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(i, 'label', e.target.value)}
                  className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-primary-500 w-full border-none p-0 focus:ring-0"
                />
                <div className="flex items-baseline space-x-1">
                  <input
                    type="text"
                    value={stat.prefix}
                    onChange={(e) => updateStat(i, 'prefix', e.target.value)}
                    className="bg-transparent text-sm font-bold w-4 border-none p-0 focus:ring-0 text-[var(--text-muted)]"
                    placeholder="$"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(i, 'value', e.target.value)}
                    className="bg-transparent text-xl font-display font-bold w-full border-none p-0 focus:ring-0 text-[var(--text-main)]"
                  />
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => updateStat(i, 'suffix', e.target.value)}
                    className="bg-transparent text-sm font-bold w-8 border-none p-0 focus:ring-0 text-[var(--text-muted)]"
                    placeholder="B+"
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Individual Specializations">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings.service_items.map((item, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-[var(--border-subtle)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-600">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Slot {i + 1}</span>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(i, 'title', e.target.value)}
                  className="bg-transparent text-sm font-bold w-full border-none p-0 focus:ring-0 text-[var(--text-main)]"
                  placeholder="Service Title"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  className="bg-transparent text-[11px] w-full border-none p-0 focus:ring-0 text-[var(--text-muted)] h-16 resize-none leading-relaxed"
                  placeholder="Detailed description of the specialization..."
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
