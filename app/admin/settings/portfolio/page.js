'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminCard from '@/components/admin/AdminCard';
import { Save, ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function PortfolioSettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    title: "A LEGACY IN BRICK & MORTAR",
    subtitle: "Selected for architectural brilliance and investment potential in Dubai's most coveted areas.",
    items: [
      {
        title: 'Palm Jumeirah Villa',
        location: 'The Palm, Dubai',
        price: '$12.5M',
        type: 'Exclusive Villa',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Downtown Penthouse',
        location: 'Burj Khalifa District',
        price: '$8.2M',
        type: 'Luxury Penthouse',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Marina Luxury Suite',
        location: 'Dubai Marina',
        price: '$3.4M',
        type: 'Sky Suite',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      }
    ]
  });

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    async function loadSettings() {
      try {
        const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
        if (data?.content?.portfolio) {
          setSettings({
             ...settings,
             ...data.content.portfolio
          });
        }
      } catch (error) {
        if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
        console.error('Error loading portfolio settings:', error);
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
      const updatedContent = { ...(current?.content || {}), portfolio: settings };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'homepage', content: updatedContent });
      
      if (error) throw error;
      addToast('Portfolio showcase synchronized', 'success');
    } catch (error) {
      if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
      addToast('Error saving settings: ' + error.message, 'error');
    } finally {
      clearTimeout(timeoutId);
      setSaving(false);
    }
  };

  const updateItem = (index, field, value) => {
    const newList = [...settings.items];
    newList[index] = { ...newList[index], [field]: value };
    setSettings({ ...settings, items: newList });
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
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Portfolio Showcase</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-premium space-x-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Commit Changes</span>
        </button>
      </div>

      <AdminCard title="Strategic Positioning">
        <div className="space-y-4">
          <div>
            <label className="admin-label">Showcase Headline</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({...settings, title: e.target.value})}
              className="admin-input font-bold"
            />
          </div>
          <div>
            <label className="admin-label">Portfolio Philosophy</label>
            <textarea
              value={settings.subtitle}
              onChange={(e) => setSettings({...settings, subtitle: e.target.value})}
              className="admin-input h-24 resize-none"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Featured Assets">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings.items.map((item, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-[var(--border-subtle)] space-y-4">
              <div className="flex justify-between items-center bg-[var(--bg-tertiary)]/50 -mx-6 -mt-6 p-4 rounded-t-2xl border-b border-[var(--border-subtle)]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Asset {i + 1}</span>
                <Building2 className="w-4 h-4 text-primary-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="admin-label !mb-1">Property Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(i, 'title', e.target.value)}
                    className="admin-input !py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="admin-label !mb-1">Location</label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => updateItem(i, 'location', e.target.value)}
                    className="admin-input !py-2 text-[11px]"
                  />
                </div>
                <div>
                  <label className="admin-label !mb-1">Valuation</label>
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => updateItem(i, 'price', e.target.value)}
                    className="admin-input !py-2 text-[11px] font-mono"
                  />
                </div>
                <div>
                  <label className="admin-label !mb-1">Asset Class</label>
                  <input
                    type="text"
                    value={item.type}
                    onChange={(e) => updateItem(i, 'type', e.target.value)}
                    className="admin-input !py-2 text-[11px]"
                  />
                </div>
                <div>
                  <label className="admin-label !mb-1">Media URL</label>
                  <input
                    type="text"
                    value={item.image}
                    onChange={(e) => updateItem(i, 'image', e.target.value)}
                    className="admin-input !py-2 text-[10px] font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
      
      <AdminCard title="Operational Note">
        <p className="text-xs text-[var(--text-muted)] italic">
          Note: Individual property assets are managed through the dynamic blog system or a separate inventory module. This section defines the overarching strategic message for the portfolio showcase.
        </p>
      </AdminCard>
    </div>
  );
}
