import HeroSection from '@/components/landing/HeroSection';
import PortfolioSection from '@/components/landing/PortfolioSection';
import ServicesSection from '@/components/landing/ServicesSection';
import BlogPreviewSection from '@/components/landing/BlogPreviewSection';
import ContactCTA from '@/components/landing/ContactCTA';
import SectionDivider from '@/components/ui/SectionDivider';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  
  // Get dynamic site settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('content')
    .eq('id', 'homepage')
    .single();
  
  const siteSettings = settingsData?.content || {};
  
  // Fallback data for all sections
  const about = siteSettings.about || {
    title: "UNWAVERING FOCUS & STRATEGIC DEPTH",
    subtitle: "With a decade of dominance in the Dubai luxury sector, Ahmed Kapadia provides a surgical approach to real estate acquisition and portfolio management. We don't just sell property; we curate investment portfolios that define future legacy. Every client receives a bespoke blueprint for success.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000",
    stats: [
      { label: "MARKET ACCESS", value: "Unlimited", icon: 'Globe' },
      { label: "CLIENT SATISFACTION", value: "100%", icon: 'Zap' },
      { label: "ASSET VALUATION", value: "$2B+", icon: 'BarChart' },
      { label: "ACQUISITION TIME", value: "10 Days", icon: 'Sparkles' }
    ],
    points: [
      'Portfolio Diversification',
      'High-Value Asset Sourcing',
      'Market Intelligence',
      'Exclusive Network Access'
    ]
  };

  const contact = siteSettings.contact || {
    title: "BEGIN YOUR JOURNEY",
    subtitle: "Join the ranks of discerning investors who trust Ahmed Kapadia for their real estate portfolio management."
  };

  return (
    <div className="flex flex-col w-full bg-[var(--bg-main)]">
      <HeroSection />
      
      <section id="portfolio" className="relative z-20">
        <PortfolioSection />
      </section>

      <SectionDivider />

      {/* Dynamic About Section */}
      <section className="bg-[var(--bg-main)] py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="w-full md:w-1/2 relative group">
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl premium-card-border border-2 border-[var(--glass-border)]">
                <img 
                  src={about.image} 
                  alt="Ahmed Kapadia" 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)]/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 glass p-6 rounded-2xl hidden md:block max-w-[240px] premium-card-border border-2 border-[var(--glass-border)] shadow-3xl backdrop-blur-xl">
                <p className="text-primary-500 font-display italic text-lg mb-2 text-center">"True luxury is found in the details of the strategy."</p>
                <div className="h-px w-12 bg-primary-500/30 mx-auto my-3" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)] text-center">Ahmed Kapadia</p>
                <p className="text-[9px] text-[var(--text-muted)] mt-1 uppercase tracking-widest text-center">Master Advisor</p>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex items-center space-x-3 mb-6">
                <span className="h-[1px] w-8 bg-primary-500" />
                <span className="text-primary-600 font-bold tracking-[0.3em] text-[10px] uppercase">The Legacy</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-main)] leading-tight mb-8 tracking-tighter">
                {about.title}
              </h2>
              <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: about.subtitle.replace(/\n/g, '<br/>') }} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  {about.points?.map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 text-[var(--text-main)] font-semibold text-sm glass py-3 px-4 rounded-xl premium-card-border border border-[var(--glass-border)] hover:border-primary-500/30 transition-all duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />
      <ServicesSection />
      <SectionDivider />
      <BlogPreviewSection />
      <SectionDivider />
      <ContactCTA />
    </div>
  );
}
