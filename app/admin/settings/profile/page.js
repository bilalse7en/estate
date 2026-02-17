'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminCard from '@/components/admin/AdminCard';
import { Save, Image as ImageIcon, Plus, Trash2, ArrowLeft, Loader2, Award, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Timeout to prevent stuck loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    async function loadSettings() {
      try {
        const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
        if (data?.content?.profile) {
          setProfile(data.content.profile);
        }
      } catch (error) {
        if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
        console.error('Error loading profile:', error);
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
      const updatedContent = { ...(current?.content || {}), profile };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'homepage', content: updatedContent });
      
      if (error) throw error;
      addToast('Professional profile synchronized', 'success');
    } catch (error) {
      if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
      addToast('Error saving settings', 'error');
    } finally {
      clearTimeout(timeoutId);
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--color-gold)]" /></div>;
  if (!profile) return <div>No data found</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <button onClick={() => router.push('/admin/settings')} className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-500 mb-2 transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Return to Terminal</span>
          </button>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Professional Profile</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-premium space-x-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Commit Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Identity & Authority">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="admin-label">Executive Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="admin-input font-bold"
                  />
                </div>
                <div>
                  <label className="admin-label">Official Designation</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({...profile, title: e.target.value})}
                    className="admin-input"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Comprehensive Biography</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="admin-input h-32 resize-none text-xs leading-relaxed"
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard 
            title="Strategic Milestones"
            actions={
              <button 
                onClick={() => setProfile({...profile, milestones: [...profile.milestones, {year: "", title: "", company: "", description: ""}]})}
                className="btn-glass px-3 py-1 text-[9px]"
              >
                <Plus className="w-3 h-3 mr-1" /> Record Achievement
              </button>
            }
          >
            <div className="space-y-4">
              {profile.milestones?.map((m, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] relative group hover:border-[var(--color-gold)]/20 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                      <label className="admin-label">Fiscal Year</label>
                      <input type="text" value={m.year} onChange={(e) => {
                        const next = [...profile.milestones];
                        next[i].year = e.target.value;
                        setProfile({...profile, milestones: next});
                      }} className="admin-input font-bold" />
                    </div>
                    <div className="md:col-span-3 pr-8">
                      <label className="admin-label">Corporate Appointment / Key Achievement</label>
                      <input type="text" value={m.title} onChange={(e) => {
                        const next = [...profile.milestones];
                        next[i].title = e.target.value;
                        setProfile({...profile, milestones: next});
                      }} className="admin-input" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="admin-label">Institution</label>
                      <input type="text" value={m.company} onChange={(e) => {
                        const next = [...profile.milestones];
                        next[i].company = e.target.value;
                        setProfile({...profile, milestones: next});
                      }} className="admin-input text-[10px]" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="admin-label">Strategic Overview</label>
                      <textarea value={m.description} onChange={(e) => {
                        const next = [...profile.milestones];
                        next[i].description = e.target.value;
                        setProfile({...profile, milestones: next});
                      }} className="admin-input h-20 resize-none text-[10px]" />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const next = profile.milestones.filter((_, idx) => idx !== i);
                      setProfile({...profile, milestones: next});
                    }} 
                    className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Executive Appearance">
            <label className="admin-label">Portrait URI</label>
            <div className="relative mb-4">
              <input
                type="text"
                value={profile.image}
                onChange={(e) => setProfile({...profile, image: e.target.value})}
                className="admin-input pl-10 text-[9px] font-mono"
              />
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gold)]" />
            </div>
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] group relative">
              {profile.image && <img src={profile.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Executive" />}
            </div>
          </AdminCard>

          <AdminCard title="Core Accreditations">
            <label className="admin-label">Expertise Deck</label>
            <div className="space-y-2">
              {profile.skills?.map((skill, i) => (
                <div key={i} className="flex items-center space-x-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => {
                      const next = [...profile.skills];
                      next[i] = e.target.value;
                      setProfile({...profile, skills: next});
                    }}
                    className="admin-input py-1.5 text-[10px] font-bold"
                  />
                </div>
              ))}
              <button 
                onClick={() => setProfile({...profile, skills: [...profile.skills, "New Skill"]})}
                className="w-full mt-4 py-2 border border-dashed border-[var(--border-subtle)] rounded-lg text-[10px] uppercase font-bold text-[var(--text-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all"
              >
                Assemble New Skill
              </button>
            </div>
          </AdminCard>

          <AdminCard title="Strategic Call to Action">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Primary Engagement (Hero)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={profile.cta?.primaryText || 'Connect Now'}
                    onChange={(e) => setProfile({...profile, cta: {...(profile.cta || {}), primaryText: e.target.value}})}
                    className="admin-input text-[10px]"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={profile.cta?.primaryLink || '#contact'}
                    onChange={(e) => setProfile({...profile, cta: {...(profile.cta || {}), primaryLink: e.target.value}})}
                    className="admin-input text-[10px]"
                    placeholder="Redirect URL"
                  />
                </div>
              </div>
              
              <div>
                <label className="admin-label">Secondary Channel (Email)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={profile.cta?.emailText || 'Email Consultation'}
                    onChange={(e) => setProfile({...profile, cta: {...(profile.cta || {}), emailText: e.target.value}})}
                    className="admin-input text-[10px]"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={profile.cta?.emailLink || 'mailto:info@ahmedkapadia.com'}
                    onChange={(e) => setProfile({...profile, cta: {...(profile.cta || {}), emailLink: e.target.value}})}
                    className="admin-input text-[10px]"
                    placeholder="Email URI"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Concierge Channel (Call)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={profile.cta?.callText || 'Schedule Call'}
                    onChange={(e) => setProfile({...profile, cta: {...(profile.cta || {}), callText: e.target.value}})}
                    className="admin-input text-[10px]"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={profile.cta?.callLink || '/contact'}
                    onChange={(e) => setProfile({...profile, cta: {...(profile.cta || {}), callLink: e.target.value}})}
                    className="admin-input text-[10px]"
                    placeholder="Contact URL"
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Digital Presence">
            <div className="space-y-4">
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-600" />
                <input
                  type="text"
                  value={profile.socials.linkedin || ''}
                  onChange={(e) => setProfile({...profile, socials: {...profile.socials, linkedin: e.target.value}})}
                  className="admin-input pl-10 text-[9px]"
                  placeholder="LinkedIn Profile URL"
                />
              </div>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-500" />
                <input
                  type="text"
                  value={profile.socials.twitter || ''}
                  onChange={(e) => setProfile({...profile, socials: {...profile.socials, twitter: e.target.value}})}
                  className="admin-input pl-10 text-[9px]"
                  placeholder="Twitter Handle URL"
                />
              </div>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-pink-600" />
                <input
                  type="text"
                  value={profile.socials.instagram || ''}
                  onChange={(e) => setProfile({...profile, socials: {...profile.socials, instagram: e.target.value}})}
                  className="admin-input pl-10 text-[9px]"
                  placeholder="Instagram URL"
                />
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
