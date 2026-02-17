import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { FileText, Shield, Gavel, Mail, Clock, ShieldCheck, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    if (!supabase) return { title: 'Corporate Page - Ahmed Kapadia' };

    const { data: page } = await supabase
      .from('site_settings')
      .select('content')
      .eq('id', `page_${slug}`)
      .maybeSingle();

    if (!page || !page.content?.published) {
      return { title: 'Content Unavailable' };
    }

    const title = page.content.title || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
      title: `${title} | Ahmed Kapadia Real Estate`,
      description: `Official ${title} documentation for Ahmed Kapadia Real Estate in Dubai. Professional excellence and transparency.`,
    };
  } catch (error) {
    return { title: 'Legal Documentation - Ahmed Kapadia' };
  }
}

export default async function CustomPage({ params }) {
  const { slug } = await params;
  let pageData = null;

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', `page_${slug}`)
        .maybeSingle();
      
      if (data && data.content?.published) {
        pageData = data.content;
      }
    }
  } catch (e) {
    console.error(`Error fetching page ${slug}:`, e);
  }

  if (!pageData) {
    notFound();
  }

  const renderContent = (blocks) => {
    if (!blocks) return null;
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'header':
          const Tag = `h${block.data.level}`;
          const sizeClasses = {
            1: 'text-4xl md:text-6xl mb-8',
            2: 'text-3xl md:text-4xl mt-12 mb-6',
            3: 'text-2xl md:text-3xl mt-8 mb-4'
          };
          return (
            <Tag key={index} className={`font-display font-bold text-[var(--text-main)] ${sizeClasses[block.data.level] || 'text-2xl'}`}>
              {block.data.text}
            </Tag>
          );
        case 'paragraph':
          return (
            <p key={index} className="text-lg leading-relaxed text-[var(--text-muted)] mb-6 opacity-90" dangerouslySetInnerHTML={{ __html: block.data.text }} />
          );
        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index} className={`mb-8 ml-6 space-y-3 text-lg text-[var(--text-muted)] ${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
              {block.data.items.map((item, i) => (
                <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ListTag>
          );
        default:
          return null;
      }
    });
  };

  const getIcon = () => {
    if (slug.includes('privacy')) return <ShieldCheck className="w-12 h-12 text-primary-500" />;
    if (slug.includes('terms') || slug.includes('engagement')) return <Gavel className="w-12 h-12 text-primary-500" />;
    if (slug.includes('contact')) return <Mail className="w-12 h-12 text-primary-500" />;
    return <FileText className="w-12 h-12 text-primary-500" />;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-20 text-center">
          <div className="inline-flex p-4 rounded-3xl bg-primary-500/5 border border-primary-500/10 mb-6">
            {getIcon()}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-[var(--text-main)] mb-6">
            {pageData.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-primary-500" /> Updated {new Date(pageData.updated_at).toLocaleDateString()}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--glass-border)]" />
            <span className="flex items-center"><Shield className="w-3.5 h-3.5 mr-1.5 text-primary-500" /> Verified Legal Document</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="glass p-10 md:p-16 rounded-[2.5rem] gradient-border-brown shadow-4xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 prose prose-invert prose-gold max-w-none">
            {renderContent(pageData.blocks)}
          </div>

          {/* Verification Footer */}
          <div className="mt-20 pt-10 border-t border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary-500" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">
                Excellence • Integrity • Discretion
              </p>
            </div>
            <p className="text-[10px] font-mono text-[var(--text-muted)]">
              REF: AK-LEG-2024-{slug.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
