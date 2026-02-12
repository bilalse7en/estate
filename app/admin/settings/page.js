'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import AdminCard from '@/components/admin/AdminCard';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Layout, Loader2, CheckCircle, User, Briefcase, Building2, Mail, Trash2, Phone, Award, Globe, Linkedin, Twitter, Instagram, Plus } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  
  const [settings, setSettings] = useState({
    hero_slides: [{ title: "", subtitle: "", image: "" }],
    about: {
      title: "UNWAVERING FOCUS & STRATEGIC DEPTH",
      subtitle: "With a decade of dominance in the Dubai luxury sector...",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000",
      stats: [
        { label: "Global Reach", value: "30+ Countries" },
        { label: "Yearly Growth", value: "18.4%" },
        { label: "Portfolio Value", value: "$850M+" },
        { label: "Transaction Speed", value: "< 14 Days" }
      ]
    },
    contact: {
      phone: "+971 4 XXX XXXX",
      email: "info@ahmedkapadia.com",
      address: "Downtown Dubai, UAE"
    },
    portfolio: {
      title: "A LEGACY IN BRICK & MORTAR",
      subtitle: "Selected for architectural brilliance and investment potential in Dubai's most coveted areas."
    },
    services: {
      title: "BEYOND THE CONVENTIONAL",
      subtitle: "We define a new standard in real estate consulting, where every detail is managed with surgical precision."
    },
    profile: {
      name: "Ahmed Hameed Kapadia",
      title: "Premium Real Estate Investment Consultant",
      bio: "With over a decade of experience in the Dubai luxury market, I specialize in securing high-value assets for a global clientele. My approach combines deep market intelligence with uncompromising integrity.",
      image: "https://uykgpmgcayncaddtsspu.supabase.co/storage/v1/object/public/media/1770897883828-c9o4uj39666.webp",
      stats: [
        { label: "Market Dominance", value: "12+ Years" },
        { label: "Portfolio Value", value: "$1.2B+" },
        { label: "Client Satisfaction", value: "100%" }
      ],
      milestones: [
        { year: "2024", title: "Senior Investment Partner", company: "Exclusive Assets Group", description: "Spearheading luxury acquisitions in Downtown Dubai and Palm Jumeirah." },
        { year: "2020", title: "Lead Real Estate Advisor", company: "Premium Dubai Realty", description: "Managed a portfolio of 500+ commercial and residential units." }
      ],
      skills: ["Strategic Negotiation", "Market Intelligence", "Portfolio Management", "Luxury Asset Acquisition"],
      socials: {
        linkedin: "https://www.linkedin.com/in/ahmedhameedkapadia",
        twitter: "https://twitter.com/ahmedkapadia",
        instagram: "https://instagram.com/ahmedkapadia"
      }
    }
  });

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').single();
      if (data?.content) {
        setSettings({ ...settings, ...data.content });
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'homepage', content: settings });
    
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-[var(--color-gold)] mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Loading Master Configuration</p>
    </div>
  );

  const tabs = [
    { id: 'hero', label: 'Showcase', icon: Layout },
    { id: 'about', label: 'Biography', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: Award },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'contact', label: 'Channels', icon: Mail }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)] mb-1">Corporate System</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">CMS Master Terminal</p>
        </div>
        <div className="flex items-center space-x-4">
          {success && (
            <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="text-green-500 text-[9px] font-bold tracking-widest uppercase flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Synchronized
            </motion.div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-premium space-x-2"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Commit Changes</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:w-48 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative ${
                activeTab === tab.id 
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-main)] border border-[var(--border-subtle)]' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-tertiary)]/50'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-[var(--color-gold)]' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`} />
              <span className="text-[10px] font-bold tracking-widest uppercase">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[var(--color-gold)] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Configuration Module */}
        <div className="flex-grow">
          {activeTab === 'hero' && (
            <AdminCard 
              title="Visual Showcase Engine"
              actions={
                <button 
                  onClick={() => setSettings({...settings, hero_slides: [...settings.hero_slides, {title:"", subtitle:"", image:""}]})}
                  className="text-[9px] font-bold text-[var(--color-gold)] hover:underline uppercase tracking-widest"
                >
                  Add Slide
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.hero_slides.map((slide, index) => (
                  <div key={index} className="p-4 rounded-lg bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] space-y-3 relative group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Descriptor #{index+1}</span>
                      {settings.hero_slides.length > 1 && (
                        <button onClick={() => {
                          const newSlides = settings.hero_slides.filter((_, i) => i !== index);
                          setSettings({ ...settings, hero_slides: newSlides });
                        }} className="text-red-500/50 hover:text-red-500 transition-colors focus-ring p-1 rounded">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="admin-label">Slide Title</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const next = [...settings.hero_slides];
                          next[index].title = e.target.value;
                          setSettings({...settings, hero_slides: next});
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Narration</label>
                      <textarea
                        value={slide.subtitle}
                        onChange={(e) => {
                          const next = [...settings.hero_slides];
                          next[index].subtitle = e.target.value;
                          setSettings({...settings, hero_slides: next});
                        }}
                        className="admin-input h-16 resize-none"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Image URI</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => {
                            const next = [...settings.hero_slides];
                            next[index].image = e.target.value;
                            setSettings({...settings, hero_slides: next});
                          }}
                          className="admin-input pl-8"
                        />
                        <ImageIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)] opacity-50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}

          {activeTab === 'about' && (
            <AdminCard title="Executive Biography">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="admin-label">Legacy Headline</label>
                    <input
                      type="text"
                      value={settings.about.title}
                      onChange={(e) => setSettings({...settings, about: {...settings.about, title: e.target.value}})}
                      className="admin-input font-bold"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Detailed Biography</label>
                    <textarea
                      value={settings.about.subtitle}
                      onChange={(e) => setSettings({...settings, about: {...settings.about, subtitle: e.target.value}})}
                      className="admin-input h-48 resize-none leading-relaxed"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="admin-label">Portrait Representation</label>
                    <input
                      type="text"
                      value={settings.about.image}
                      onChange={(e) => setSettings({...settings, about: {...settings.about, image: e.target.value}})}
                      className="admin-input text-[10px] mb-3"
                    />
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
                      <img src={settings.about.image} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {settings.about.stats.map((stat, i) => (
                      <div key={i}>
                        <label className="admin-label">{stat.label}</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const next = [...settings.about.stats];
                            next[i].value = e.target.value;
                            setSettings({...settings, about: {...settings.about, stats: next}});
                          }}
                          className="admin-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AdminCard>
          )}

          {activeTab === 'portfolio' && (
            <AdminCard title="Investment Portfolio Deck">
              <div className="space-y-4">
                <div>
                  <label className="admin-label">Showcase Headline</label>
                  <input
                    type="text"
                    value={settings.portfolio.title}
                    onChange={(e) => setSettings({...settings, portfolio: {...settings.portfolio, title: e.target.value}})}
                    className="admin-input font-bold"
                  />
                </div>
                <div>
                  <label className="admin-label">Portfolio Narrative</label>
                  <textarea
                    value={settings.portfolio.subtitle}
                    onChange={(e) => setSettings({...settings, portfolio: {...settings.portfolio, subtitle: e.target.value}})}
                    className="admin-input h-24 resize-none"
                  />
                </div>
              </div>
            </AdminCard>
          )}

          {activeTab === 'services' && (
            <AdminCard title="Strategic Service Suite">
              <div className="space-y-4">
                <div>
                  <label className="admin-label">Operational Headline</label>
                  <input
                    type="text"
                    value={settings.services.title}
                    onChange={(e) => setSettings({...settings, services: {...settings.services, title: e.target.value}})}
                    className="admin-input font-bold"
                  />
                </div>
                <div>
                  <label className="admin-label">Service Philosophy</label>
                  <textarea
                    value={settings.services.subtitle}
                    onChange={(e) => setSettings({...settings, services: {...settings.services, subtitle: e.target.value}})}
                    className="admin-input h-24 resize-none"
                  />
                </div>
              </div>
            </AdminCard>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <AdminCard title="Professional Persona">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="admin-label">Full Name</label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => setSettings({...settings, profile: {...settings.profile, name: e.target.value}})}
                        className="admin-input font-bold"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Professional Designation</label>
                      <input
                        type="text"
                        value={settings.profile.title}
                        onChange={(e) => setSettings({...settings, profile: {...settings.profile, title: e.target.value}})}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Portrait URL</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={settings.profile.image}
                          onChange={(e) => setSettings({...settings, profile: {...settings.profile, image: e.target.value}})}
                          className="admin-input pl-8"
                        />
                        <ImageIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-gold)]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Biography Highlights</label>
                    <textarea
                      value={settings.profile.bio}
                      onChange={(e) => setSettings({...settings, profile: {...settings.profile, bio: e.target.value}})}
                      className="admin-input h-40 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </AdminCard>

              <AdminCard 
                title="Career Milestones"
                actions={
                  <button 
                    onClick={() => setSettings({...settings, profile: {...settings.profile, milestones: [...settings.profile.milestones, {year: "", title: "", company: "", description: ""}]}})}
                    className="text-[9px] font-bold text-[var(--color-gold)] hover:underline uppercase tracking-widest flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Milestone
                  </button>
                }
              >
                <div className="space-y-4">
                  {settings.profile.milestones.map((m, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-strong)] grid grid-cols-1 md:grid-cols-4 gap-4 relative group">
                      <div className="md:col-span-1">
                        <label className="admin-label">Year</label>
                        <input type="text" value={m.year} onChange={(e) => {
                          const next = [...settings.profile.milestones];
                          next[i].year = e.target.value;
                          setSettings({...settings, profile: {...settings.profile, milestones: next}});
                        }} className="admin-input" />
                      </div>
                      <div className="md:col-span-3 pr-8">
                        <label className="admin-label">Position / Achievement</label>
                        <input type="text" value={m.title} onChange={(e) => {
                          const next = [...settings.profile.milestones];
                          next[i].title = e.target.value;
                          setSettings({...settings, profile: {...settings.profile, milestones: next}});
                        }} className="admin-input" />
                      </div>
                      <div className="md:col-span-1">
                        <label className="admin-label">Institution</label>
                        <input type="text" value={m.company} onChange={(e) => {
                          const next = [...settings.profile.milestones];
                          next[i].company = e.target.value;
                          setSettings({...settings, profile: {...settings.profile, milestones: next}});
                        }} className="admin-input" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="admin-label">Description</label>
                        <textarea value={m.description} onChange={(e) => {
                          const next = [...settings.profile.milestones];
                          next[i].description = e.target.value;
                          setSettings({...settings, profile: {...settings.profile, milestones: next}});
                        }} className="admin-input h-16 resize-none" />
                      </div>
                      <button onClick={() => {
                        const next = settings.profile.milestones.filter((_, idx) => idx !== i);
                        setSettings({...settings, profile: {...settings.profile, milestones: next}});
                      }} className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </AdminCard>

              <AdminCard title="Digital Footprint">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="admin-label flex items-center"><Linkedin className="w-3 h-3 mr-1.5" /> LinkedIn</label>
                    <input
                      type="text"
                      value={settings.profile.socials.linkedin}
                      onChange={(e) => setSettings({...settings, profile: {...settings.profile, socials: {...settings.profile.socials, linkedin: e.target.value}}})}
                      className="admin-input text-[10px]"
                    />
                  </div>
                  <div>
                    <label className="admin-label flex items-center"><Twitter className="w-3 h-3 mr-1.5" /> X (Twitter)</label>
                    <input
                      type="text"
                      value={settings.profile.socials.twitter}
                      onChange={(e) => setSettings({...settings, profile: {...settings.profile, socials: {...settings.profile.socials, twitter: e.target.value}}})}
                      className="admin-input text-[10px]"
                    />
                  </div>
                  <div>
                    <label className="admin-label flex items-center"><Instagram className="w-3 h-3 mr-1.5" /> Instagram</label>
                    <input
                      type="text"
                      value={settings.profile.socials.instagram}
                      onChange={(e) => setSettings({...settings, profile: {...settings.profile, socials: {...settings.profile.socials, instagram: e.target.value}}})}
                      className="admin-input text-[10px]"
                    />
                  </div>
                </div>
              </AdminCard>
            </div>
          )}

          {activeTab === 'contact' && (
            <AdminCard title="Channel Configuration">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Direct Line</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={settings.contact.phone}
                      onChange={(e) => setSettings({...settings, contact: {...settings.contact, phone: e.target.value}})}
                      className="admin-input pl-8"
                    />
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-gold)]" />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Correspondence</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={settings.contact.email}
                      onChange={(e) => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})}
                      className="admin-input pl-8"
                    />
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-gold)]" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="admin-label">HQ Coordinates</label>
                  <input
                    type="text"
                    value={settings.contact.address}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})}
                    className="admin-input"
                  />
                </div>
              </div>
            </AdminCard>
          )}
        </div>
      </div>
    </div>
  );
}
