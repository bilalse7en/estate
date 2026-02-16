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
  const [services, setServices] = useState({
    title: "",
    subtitle: ""
  });

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    async function loadSettings() {
      const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
      if (data?.content?.services) {
        setServices(data.content.services);
      }
      clearTimeout(timeout);
      setLoading(false);
    }
    loadSettings();
    return () => clearTimeout(timeout);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: current } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
      const updatedContent = { ...(current?.content || {}), services };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'homepage', content: updatedContent });
      
      if (error) throw error;
      addToast('Service suite synchronized', 'success');
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
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Strategic Service Suite</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-premium space-x-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Commit Changes</span>
        </button>
      </div>

      <AdminCard title="Operational Framework">
        <div className="space-y-6 max-w-4xl">
          <div>
            <label className="admin-label">Service Master Headline</label>
            <div className="relative">
              <input
                type="text"
                value={services.title}
                onChange={(e) => setServices({...services, title: e.target.value})}
                className="admin-input font-bold pl-12"
              />
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-gold)]" />
            </div>
          </div>
          <div>
            <label className="admin-label">Service Philosophy & methodology</label>
            <textarea
              value={services.subtitle}
              onChange={(e) => setServices({...services, subtitle: e.target.value})}
              className="admin-input h-48 resize-none leading-relaxed"
              placeholder="Describe the unique value proposition..."
            />
          </div>
        </div>
      </AdminCard>
      
      <AdminCard title="Implementation Detail">
        <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
          This section defines the corporate voice for your consulting operations. Ensure the tone is authoritative and reflects the premium nature of Dubai's luxury real estate sector.
        </p>
      </AdminCard>
    </div>
  );
}
