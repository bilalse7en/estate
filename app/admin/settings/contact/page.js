'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminCard from '@/components/admin/AdminCard';
import { Save, ArrowLeft, Loader2, Phone, Mail, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function ContactSettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contact, setContact] = useState({
    title: "",
    subtitle: "",
    phone: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);

    async function loadSettings() {
      try {
        const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
        if (data?.content?.contact) {
          setContact(data.content.contact);
        }
      } catch (error) {
        if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
        console.error('Error loading contact settings:', error);
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
      const updatedContent = { ...(current?.content || {}), contact };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'homepage', content: updatedContent });
      
      if (error) throw error;
      addToast('Contact channels synchronized', 'success');
    } catch (error) {
      if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
      addToast('Error saving contact settings', 'error');
    } finally {
      clearTimeout(timeoutId);
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
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Contact Channels</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-premium space-x-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Commit Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Direct Correspondence">
          <div className="space-y-6">
            <div>
              <label className="admin-label">Correspondence Headline</label>
              <input
                type="text"
                value={contact.title}
                onChange={(e) => setContact({...contact, title: e.target.value})}
                className="admin-input font-bold"
              />
            </div>
            <div>
              <label className="admin-label">Strategic CTA Text</label>
              <textarea
                value={contact.subtitle}
                onChange={(e) => setContact({...contact, subtitle: e.target.value})}
                className="admin-input h-24 resize-none text-xs"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Communication Lines">
          <div className="space-y-6">
            <div>
              <label className="admin-label">Private Line (Phone)</label>
              <div className="relative">
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => setContact({...contact, phone: e.target.value})}
                  className="admin-input font-mono pl-12"
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gold)]" />
              </div>
            </div>
            <div>
              <label className="admin-label">Priority Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({...contact, email: e.target.value})}
                  className="admin-input font-mono pl-12"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gold)]" />
              </div>
            </div>
            <div>
              <label className="admin-label">Global HQ Coordinates (Address)</label>
              <div className="relative">
                <input
                  type="text"
                  value={contact.address}
                  onChange={(e) => setContact({...contact, address: e.target.value})}
                  className="admin-input pl-12"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gold)]" />
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
      
      <AdminCard title="Security Protocol">
        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
          Data encryption active. All correspondence channels are secured with institutional-grade protocols.
        </p>
      </AdminCard>
    </div>
  );
}
