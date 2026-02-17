'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { 
  Linkedin, Twitter, Instagram, ArrowRight, Award, 
  MapPin, Briefcase, GraduationCap, TrendingUp, ShieldCheck,
Building2, Users, Target, Lightbulb, BarChart3, Globe2,
  Star, Trophy, CheckCircle2, Mail, Phone, Sparkles
} from 'lucide-react';

export default function PortfolioPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Portfolio data fetch timeout - using fallback');
      setProfile({
        name: "Ahmed Hameed Kapadia",
        title: "Premium Real Estate Investment Consultant",
        bio: "With over a decade of experience in the Dubai luxury market, I specialize in securing high-value assets for a global clientele.",
        image: "https://uykgpmgcayncaddtsspu.supabase.co/storage/v1/object/public/media/1770897883828-c9o4uj39666.webp",
        stats: [
          { label: "Market Dominance", value: "12+ Years" },
          { label: "Portfolio Value", value: "$1.2B+" },
          { label: "Client Satisfaction", value: "100%" }
        ],
        milestones: [
          { year: "2024", title: "Senior Investment Partner", company: "Exclusive Assets Group", description: "Spearheading luxury acquisitions." }
        ],
        skills: ["Strategic Negotiation", "Market Intelligence"],
        socials: { linkedin: "", twitter: "", instagram: "" }
      });
      setLoading(false);
    }, 3000); // 3 second timeout

    async function loadProfile() {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }

        // 1. Fetch Professional Profile (Identity)
        const { data: homeData } = await supabase.from('site_settings').select('content').eq('id', 'homepage').maybeSingle();
        
        // 2. Fetch Portfolio Page Content (Narrative Blocks)
        const { data: pageData } = await supabase.from('site_settings').select('content').eq('id', 'page_portfolio').maybeSingle();
        
        clearTimeout(timeout);
        
        if (homeData?.content?.profile) {
          const profileData = homeData.content.profile;
          // Merge with page content if it exists
          if (pageData?.content) {
            profileData.pageBlocks = pageData.content.blocks || [];
            profileData.expertise = pageData.content.expertise || [];
            profileData.certifications = pageData.content.certifications || [];
            // Merge page-specific CTA if available
            if (pageData.content.cta) {
              profileData.cta = {
                ...(profileData.cta || {}),
                ...pageData.content.cta
              };
            }
          }
          setProfile(profileData);
        } else {
          // Fallback logic kept for safety
          setProfile({
            name: "Ahmed Hameed Kapadia",
            title: "Premium Real Estate Investment Consultant",
            bio: "With over a decade of experience in the Dubai luxury market, I specialize in securing high-value assets for a global clientele.",
            image: "https://uykgpmgcayncaddtsspu.supabase.co/storage/v1/object/public/media/1770897883828-c9o4uj39666.webp",
            stats: [
              { label: "Market Dominance", value: "12+ Years" },
              { label: "Portfolio Value", value: "$1.2B+" },
              { label: "Client Satisfaction", value: "100%" }
            ],
            milestones: [
              { year: "2024", title: "Senior Investment Partner", company: "Exclusive Assets Group", description: "Spearheading luxury acquisitions." }
            ],
            skills: ["Strategic Negotiation", "Market Intelligence"],
            socials: { linkedin: "", twitter: "", instagram: "" },
            pageBlocks: pageData?.content?.blocks || [],
            expertise: pageData?.content?.expertise || [],
            certifications: pageData?.content?.certifications || []
          });
        }
      } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') return;
        console.error('Portfolio load error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();

    // Cleanup timeout on unmount
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-b-2 border-primary-500 rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">Establishing Secure Connection</p>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-10 text-center">
      <div className="glass p-12 rounded-3xl border border-[var(--glass-border)] max-w-lg">
        <h2 className="text-2xl font-display font-bold text-[var(--text-main)] mb-4">Configuration Required</h2>
        <p className="text-[var(--text-muted)] mb-8">The professional profile has not been initialized. Please configure the CMS Master Terminal.</p>
        <a href="/admin/settings" className="btn-premium px-8 py-3">Access Terminal</a>
      </div>
    </div>
  );

  // Expertise areas based on real estate
  const expertiseAreas = (profile.expertise && profile.expertise.length > 0) ? profile.expertise : [
    { title: "Luxury Properties", description: "High-end residential & commercial", icon: Building2 },
    { title: "Investment Strategy", description: "ROI-focused portfolio building", icon: Target },
    { title: "Client Relations", description: "Personalized VIP service", icon: Users },
    { title: "Global Network", description: "International market access", icon: Globe2 },
    { title: "Market Analysis", description: "Data-driven insights", icon: BarChart3 },
    { title: "Innovation", description: "Cutting-edge solutions", icon: Lightbulb }
  ];

  // Certifications & Awards
  const certifications = (profile.certifications && profile.certifications.length > 0) ? profile.certifications : [
    { title: "Top 1% Realtor", year: "2023-2024", icon: Trophy },
    { title: "Excellence in Service", year: "2022", icon: Award },
    { title: "Client Choice Award", year: "2021", icon: Star },
    { title: "Certified Luxury Specialist", year: "2020", icon: ShieldCheck }
  ];

  // Icon mapping for dynamic fields
  const getIcon = (item, type) => {
    if (item.icon) return item.icon;
    if (type === 'expertise') return Sparkles;
    return Award;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* COMPACT HERO SECTION */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Profile Image - Compact */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden gradient-border-brown relative">
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-transparent opacity-50" />
              </div>
            </motion.div>

            {/* Content - Compact */}
<div className="lg:col-span-8">
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass gradient-border-brown mb-4">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-main)]">Exclusive Assets Group</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[var(--text-main)] leading-[1.1] mb-3">
                {profile.name.split(' ').length > 1 ? (
                  <>
                    {profile.name.split(' ')[0]} <span className="gradient-text">{profile.name.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  <span className="gradient-text">{profile.name}</span>
                )}
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-[var(--text-muted)] font-light mb-6 italic">
                "{profile.title}"
              </motion.p>

              <motion.p variants={itemVariants} className="text-base text-[var(--text-muted)] leading-relaxed mb-6">
                {profile.bio}
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-6">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[9px] font-bold uppercase tracking-wider text-[var(--text-main)]">
                    {skill}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
                <a href={profile.cta?.primaryLink || "#contact"} className="btn-premium px-6 py-3 text-sm">
                  {profile.cta?.primaryText || "Connect Now"}
                </a>
                {profile.socials.linkedin && (
                  <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full glass border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-500/50 transition-all">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.twitter && (
                  <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full glass border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-500/50 transition-all">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.instagram && (
                  <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full glass border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-500/50 transition-all">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMPACT STATS */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-2xl gradient-border-brown group hover:border-primary-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform" />
                  <CheckCircle2 className="w-4 h-4 text-primary-500 opacity-50" />
                </div>
                <h3 className="text-3xl font-display font-bold text-[var(--text-main)] mb-1">{stat.value}</h3>
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTISE AREAS - COMPACT GRID */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-main)] mb-2">Areas of <span className="text-primary-500">Expertise</span></h2>
            <p className="text-sm text-[var(--text-muted)]">Comprehensive real estate solutions</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {expertiseAreas.map((area, i) => {
              const Icon = getIcon(area, 'expertise');
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass p-5 rounded-2xl gradient-border-brown text-center group hover:border-primary-500/50 transition-all hover:transform hover:scale-105"
                >
                  <Icon className="w-8 h-8 text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs font-bold text-[var(--text-main)] mb-1">{area.title}</h3>
                  <p className="text-[8px] text-[var(--text-muted)] leading-tight">{area.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS & AWARDS - COMPACT */}
      <section className="py-16 bg-[var(--bg-secondary)]/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-main)] mb-2">Certifications & <span className="text-primary-500">Awards</span></h2>
            <p className="text-sm text-[var(--text-muted)]">Recognition of excellence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert, i) => {
              const Icon = getIcon(cert, 'certification');
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6 rounded-2xl gradient-border-brown group hover:border-primary-500/50 transition-colors"
                >
                  <Icon className="w-10 h-10 text-primary-500 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all" />
                  <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">{cert.title}</h3>
                  <p className="text-xs text-primary-500 font-semibold">{cert.year}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPACT TIMELINE */}
      <section id="milestones" className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-main)] mb-2">Professional <span className="text-primary-500">Timeline</span></h2>
            <div className="w-16 h-1 bg-primary-500 mx-auto rounded-full mt-3" />
          </motion.div>

          <div className="space-y-6">
            {profile.milestones.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-2xl gradient-border-brown group hover:border-primary-500/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <span className="text-primary-500 font-display font-bold text-lg">{m.year}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">{m.title}</h3>
                    <p className="text-[9px] uppercase tracking-widest text-[var(--color-gold)] font-bold mb-2">{m.company}</p>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{m.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC CONTENT BLOCKS FROM SITE PAGES */}
      {profile?.pageBlocks && profile.pageBlocks.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="space-y-12">
              {profile.pageBlocks.map((block, index) => {
                switch (block.type) {
                  case 'header':
                    const HeaderTag = `h${block.data.level || 2}`;
                    const headerClasses = {
                      1: "text-4xl md:text-5xl font-display font-bold text-[var(--text-main)] mb-6",
                      2: "text-3xl md:text-4xl font-display font-bold text-[var(--text-main)] mb-6",
                      3: "text-2xl md:text-3xl font-display font-bold text-[var(--text-main)] mb-4",
                      4: "text-xl md:text-2xl font-display font-bold text-[var(--text-main)] mb-4",
                    };
                    return (
                      <motion.div
                        key={block.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <HeaderTag className={headerClasses[block.data.level] || headerClasses[2]} dangerouslySetInnerHTML={{ __html: block.data.text }} />
                      </motion.div>
                    );
                  
                  case 'paragraph':
                    return (
                      <motion.p
                        key={block.id || index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-lg text-[var(--text-muted)] leading-relaxed mb-6"
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                      />
                    );

                  case 'image':
                    return (
                      <motion.div
                        key={block.id || index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="my-10 rounded-3xl overflow-hidden gradient-border-brown shadow-2xl"
                      >
                        <img 
                          src={block.data.file.url} 
                          alt={block.data.caption || ""} 
                          className="w-full h-auto object-cover"
                        />
                        {block.data.caption && (
                          <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] text-center italic text-sm text-[var(--text-muted)]">
                            {block.data.caption}
                          </div>
                        )}
                      </motion.div>
                    );

                  case 'list':
                    return (
                      <motion.ul
                        key={block.id || index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`space-y-3 mb-6 ${block.data.style === 'ordered' ? 'list-decimal pl-6' : ''}`}
                      >
                        {block.data.items.map((item, i) => (
                          <li key={i} className="text-[var(--text-muted)] pl-2">
                            {block.data.style !== 'ordered' && <span className="mr-3 text-primary-500">▹</span>}
                            <span dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </motion.ul>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </section>
      )}

      {/* COMPACT CTA */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-12 rounded-3xl gradient-border-brown text-center relative overflow-hidden"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-main)] mb-4">
              Let's Discuss Your <span className="text-primary-500">Investment Goals</span>
            </h2>
            <p className="text-[var(--text-muted)] mb-8 max-w-2xl mx-auto">
              Available for private consultations and portfolio management strategies across Dubai's most prestigious developments.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={profile.cta?.emailLink || "mailto:info@ahmedkapadia.com"} className="btn-premium px-8 py-3 text-sm inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {profile.cta?.emailText || "Email Consultation"}
              </a>
              <a href={profile.cta?.callLink || "/contact"} className="glass px-8 py-3 rounded-full text-sm font-bold text-[var(--text-main)] hover:border-primary-500/50 border border-[var(--glass-border)] transition-colors inline-flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {profile.cta?.callText || "Schedule Call"}
              </a>
            </div>
            
            {/* Visual Accents */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/10 blur-[80px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary-500/10 blur-[80px] rounded-full" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
