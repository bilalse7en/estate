import { createClient } from '@/lib/supabase/server';
import SubmitFormPage from '@/app/submit-form/page'; // Reuse the existing form logic
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  let pageData = null;

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'page_contact-protocol')
        .maybeSingle();
      
      if (data && data.content?.published) {
        pageData = data.content;
      }
    }
  } catch (e) {
    console.error('Error fetching contact page data:', e);
  }

  // Fallback content if not in DB
  const title = pageData?.title || "Initiate Correspondence";
  const blocks = pageData?.blocks || [
    { type: 'paragraph', data: { text: "Experience the pinnacle of Dubai real estate consulting. Our private office is available for dedicated investment strategy sessions." } }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Hero / Header Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-[var(--text-main)] mb-8">
            {title}
          </h1>
          <div className="max-w-2xl mx-auto opacity-70 text-lg leading-relaxed mb-12">
            {blocks.filter(b => b.type === 'paragraph').map((b, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: b.data.text }} />
            ))}
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Main Contact Section */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form Side - We'll simply reuse the SubmitFormPage logic but without its layout wrapper if possible */}
            <div className="glass p-8 md:p-12 rounded-[2.5rem] gradient-border-brown shadow-4xl order-2 lg:order-1">
              <SubmitFormPage standalone={true} />
            </div>

            {/* Info Side */}
            <div className="space-y-8 order-1 lg:order-2 lg:pl-12">
              <div className="glass p-10 rounded-3xl gradient-border-brown space-y-8">
                <h3 className="text-2xl font-display font-bold text-[var(--text-main)] border-b border-[var(--glass-border)] pb-6">Channel Access</h3>
                
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/20 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-primary-500 mb-1">Direct Line</p>
                    <p className="text-xl font-bold text-[var(--text-main)]">+971 4 XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/20 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-primary-500 mb-1">Executive Inbox</p>
                    <p className="text-xl font-bold text-[var(--text-main)]">info@ahmedkapadia.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/20 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-primary-500 mb-1">Dubai HQ</p>
                    <p className="text-xl font-bold text-[var(--text-main)] leading-tight">Level 42, Burj Khalifa District<br/>Downtown Dubai, UAE</p>
                  </div>
                </div>
              </div>

              <div className="glass p-8 rounded-3xl border border-primary-500/20 bg-primary-500/5">
                <div className="flex items-center space-x-3 mb-4 text-primary-500">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Secure Data Protocol</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Your communication as a private client is protected by our strict confidentiality charter. All inquiries are handled with absolute discretion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
