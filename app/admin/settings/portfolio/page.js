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
  const [portfolio, setPortfolio] = useState({
    title: "",
    subtitle: ""
  });

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
      if (data?.content?.portfolio) {
        setPortfolio(data.content.portfolio);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: current } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
      const updatedContent = { ...(current?.content || {}), portfolio };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'homepage', content: updatedContent });
      
      if (error) throw error;
      addToast('Portfolio narrative synchronized', 'success');
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
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Investment Portfolio</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-premium space-x-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Commit Changes</span>
        </button>
      </div>

      <AdminCard title="Strategic Positioning">
        <div className="space-y-6 max-w-4xl">
          <div>
            <label className="admin-label">Showcase Headline</label>
            <div className="relative">
              <input
                type="text"
                value={portfolio.title}
                onChange={(e) => setPortfolio({...portfolio, title: e.target.value})}
                className="admin-input font-bold pl-12"
              />
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-gold)]" />
            </div>
          </div>
          <div>
            <label className="admin-label">Portfolio Philosophy & Narrative</label>
            <textarea
              value={portfolio.subtitle}
              onChange={(e) => setPortfolio({...portfolio, subtitle: e.target.value})}
              className="admin-input h-48 resize-none leading-relaxed"
              placeholder="Define the criteria for property selection..."
            />
          </div>
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
