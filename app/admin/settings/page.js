'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Save, Image as ImageIcon, Type, Layout, Loader2, CheckCircle, Plus, Trash2, User, BarChart3, Mail, Briefcase, Building2 } from 'lucide-react';

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

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10" /></div>;

  const tabs = [
    { id: 'hero', label: 'Hero Slides', icon: Layout },
    { id: 'about', label: 'Biography', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Building2 },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 sticky top-0 z-50 py-6 glass-dark px-10 -mx-10 rounded-b-[2rem]">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">Corporate CMS</h1>
          <p className="text-[10px] text-primary-500 uppercase tracking-[0.4em] font-bold">Authorized Access Only</p>
        </div>
        <div className="flex items-center gap-4">
          {success && (
            <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="text-green-400 text-[10px] font-bold tracking-widest uppercase flex items-center">
              <CheckCircle className="w-3 h-3 mr-2" /> Live Updated
            </motion.div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-premium flex items-center space-x-3 px-10 !py-4 shadow-2xl"
          >
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span className="text-[11px] tracking-[0.3em] font-bold">PUBLISH CHANGES</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === tab.id 
                  ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20' 
                  : 'glass text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-primary-500/50 group-hover:text-primary-500'}`} />
              <span className="text-xs font-bold tracking-widest uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow glass p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02]">
          {activeTab === 'hero' && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Main Showcase Slider</h3>
                <button onClick={() => setSettings({...settings, hero_slides: [...settings.hero_slides, {title:"", subtitle:"", image:""}]})} className="text-[10px] font-bold text-primary-500 hover:underline tracking-widest uppercase flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Add New Slide
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {settings.hero_slides.map((slide, index) => (
                  <div key={index} className="glass p-6 rounded-2xl border border-white/5 bg-black/20 space-y-4">
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase">
                      <span>SLIDE #{index+1}</span>
                      {settings.hero_slides.length > 1 && (
                        <button onClick={() => {
                          const newSlides = settings.hero_slides.filter((_, i) => i !== index);
                          setSettings({ ...settings, hero_slides: newSlides });
                        }} className="text-red-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Title"
                      value={slide.title}
                      onChange={(e) => {
                        const next = [...settings.hero_slides];
                        next[index].title = e.target.value;
                        setSettings({...settings, hero_slides: next});
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary-500 outline-none transition-all"
                    />
                    <textarea
                      placeholder="Descriptions"
                      value={slide.subtitle}
                      onChange={(e) => {
                        const next = [...settings.hero_slides];
                        next[index].subtitle = e.target.value;
                        setSettings({...settings, hero_slides: next});
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white h-24 focus:border-primary-500 outline-none transition-all"
                    />
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Image Link"
                        value={slide.image}
                        onChange={(e) => {
                          const next = [...settings.hero_slides];
                          next[index].image = e.target.value;
                          setSettings({...settings, hero_slides: next});
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white focus:border-primary-500 outline-none transition-all pl-10"
                      />
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-10 animate-fade-in">
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter border-b border-white/5 pb-6">Biography & Legacy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Headline</label>
                    <input
                      type="text"
                      value={settings.about.title}
                      onChange={(e) => setSettings({...settings, about: {...settings.about, title: e.target.value}})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-display focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Detailed Biography</label>
                    <textarea
                      value={settings.about.subtitle}
                      onChange={(e) => setSettings({...settings, about: {...settings.about, subtitle: e.target.value}})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white h-52 focus:border-primary-500 outline-none transition-all leading-relaxed"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Profile Image</label>
                    <input
                      type="text"
                      value={settings.about.image}
                      onChange={(e) => setSettings({...settings, about: {...settings.about, image: e.target.value}})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white mb-4"
                    />
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
                      <img src={settings.about.image} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {settings.about.stats.map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-[10px] text-gray-600 font-bold uppercase">{stat.label}</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const next = [...settings.about.stats];
                            next[i].value = e.target.value;
                            setSettings({...settings, about: {...settings.about, stats: next}});
                          }}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-10 animate-fade-in">
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter border-b border-white/5 pb-6">Portfolio Section Header</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Section Headline</label>
                  <input
                    type="text"
                    value={settings.portfolio.title}
                    onChange={(e) => setSettings({...settings, portfolio: {...settings.portfolio, title: e.target.value}})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-display"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Section Intro</label>
                  <textarea
                    value={settings.portfolio.subtitle}
                    onChange={(e) => setSettings({...settings, portfolio: {...settings.portfolio, subtitle: e.target.value}})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white h-32"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-10 animate-fade-in">
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter border-b border-white/5 pb-6">Services Section Header</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Section Headline</label>
                  <input
                    type="text"
                    value={settings.services.title}
                    onChange={(e) => setSettings({...settings, services: {...settings.services, title: e.target.value}})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-display"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Section Intro</label>
                  <textarea
                    value={settings.services.subtitle}
                    onChange={(e) => setSettings({...settings, services: {...settings.services, subtitle: e.target.value}})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white h-32"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-10 animate-fade-in">
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter border-b border-white/5 pb-6">Direct Office Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Office Phone</label>
                  <input
                    type="text"
                    value={settings.contact.phone}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, phone: e.target.value}})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3 text-sm text-white"
                  />
                  <Phone className="absolute left-4 top-[42px] w-4 h-4 text-primary-500" />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Contact Email</label>
                  <input
                    type="text"
                    value={settings.contact.email}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3 text-sm text-white"
                  />
                  <Mail className="absolute left-4 top-[42px] w-4 h-4 text-primary-500" />
                </div>
                <div className="relative md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">HQ Address</label>
                  <input
                    type="text"
                    value={settings.contact.address}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3 text-sm text-white"
                  />
                  <MapPin className="absolute left-4 top-[42px] w-4 h-4 text-primary-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Phone = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const MapPin = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
