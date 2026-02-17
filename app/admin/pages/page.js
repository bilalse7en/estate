'use client';

import { createClient } from '@/lib/supabase/client';
import AdminCard from '@/components/admin/AdminCard';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Shield, FileText, PhoneCall, Building2, Edit, Loader2, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function AdminPagesPage() {
  const [pages, setPages] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const supabase = createClient();

  const corePages = [
    { 
      id: 'privacy-charter', 
      title: 'Privacy Charter', 
      slug: 'privacy-charter',
      description: 'Institutional data protection and privacy framework.', 
      icon: Shield 
    },
    { 
      id: 'terms-of-engagement', 
      title: 'Terms of Engagement', 
      slug: 'terms-of-engagement',
      description: 'Strategic advisory terms and legal relationship standards.', 
      icon: FileText 
    },
    { 
      id: 'contact-protocol', 
      title: 'Contact Protocol', 
      slug: 'contact-protocol',
      description: 'Direct communication channels and HQ coordinates.', 
      icon: PhoneCall 
    },
    { 
      id: 'portfolio', 
      title: 'Investment Portfolio', 
      slug: 'portfolio',
      description: 'High-value asset showcase and architectural brilliance narrative.', 
      icon: Building2 
    }
  ];

  const loadPageStatus = async () => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    setLoading(true);
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('id, content')
        .like('id', 'page_%');
      
      const statusMap = {};
      (data || []).forEach(row => {
        statusMap[row.id.replace('page_', '')] = {
          exists: true,
          published: row.content.published !== false
        };
      });
      
      // Auto-initialize missing pages on first load
      const missingPages = corePages.filter(page => !statusMap[page.slug]);
      
      if (missingPages.length > 0) {
        console.log('Auto-initializing missing pages:', missingPages.map(p => p.title));
        await initializePages(missingPages);
        // Reload after initialization
        const { data: refreshedData } = await supabase
          .from('site_settings')
          .select('id, content')
          .like('id', 'page_%');
        
        const refreshedMap = {};
        (refreshedData || []).forEach(row => {
          refreshedMap[row.id.replace('page_', '')] = {
            exists: true,
            published: row.content.published !== false
          };
        });
        setPages(refreshedMap);
      } else {
        setPages(statusMap);
      }
    } catch (e) {
      if (e.name === 'AbortError' || e.message?.includes('AbortError')) return;
      console.error('Error loading pages:', e);
      addToast('Error loading page status', 'error');
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const initializePages = async (pagesToInit) => {
    try {
      const defaults = pagesToInit.map(page => {
        const blocks = getDefaultContent(page.slug);
        return {
          id: `page_${page.slug}`,
          content: {
            title: page.title,
            published: true,
            updated_at: new Date().toISOString(),
            blocks
          }
        };
      });

      for (const page of defaults) {
        await supabase.from('site_settings').upsert(page);
      }
      
      addToast(`Initialized ${pagesToInit.length} page(s) successfully`, 'success');
    } catch (e) {
      console.error('Error initializing pages:', e);
      addToast('Initialization error: ' + e.message, 'error');
    }
  };

  const getDefaultContent = (slug) => {
    const contents = {
      'privacy-charter': [
        { type: 'header', data: { text: 'Information Privacy & Data Protection', level: 1 } },
        { type: 'paragraph', data: { text: 'At Ahmed Kapadia Real Estate, we consider the protection of your personal and financial information to be of paramount importance. This Privacy Charter outlines our uncompromising commitment to data security and transparency.' } },
        { type: 'header', data: { text: 'Data Collection & Strategic Use', level: 2 } },
        { type: 'paragraph', data: { text: 'We collect data solely to enhance your investment journey. This includes information provided through inquiry forms, consultation sessions, and digital interactions. We utilize institutional-grade encryption to ensure that your private portfolio details remain strictly confidential.' } },
        { type: 'header', data: { text: 'Your Rights & Our Obligations', level: 2 } },
        { type: 'paragraph', data: { text: 'You have the right to access, modify, or request deletion of your personal information at any time. Our commitment is to respond to all privacy requests within 48 hours and maintain complete transparency in our data handling practices.' } }
      ],
      'terms-of-engagement': [
        { type: 'header', data: { text: 'Strategic Engagement Framework', level: 1 } },
        { type: 'paragraph', data: { text: 'The following terms outline the professional relationship between Ahmed Kapadia Real Estate and our global clientele. By engaging our services, you agree to a standard of excellence and mutual integrity.' } },
        { type: 'header', data: { text: 'Scope of Advisory Services', level: 2 } },
        { type: 'paragraph', data: { text: 'Our advisory encompasses property acquisition consultation, market intelligence, negotiation support, and portfolio optimization strategies. Each engagement is tailored to your specific investment objectives and risk profile.' } },
        { type: 'header', data: { text: 'Professional Standards', level: 2 } },
        { type: 'paragraph', data: { text: 'We maintain the highest standards of professional conduct, including confidentiality, conflict-of-interest disclosure, and transparent fee structures. All recommendations are made solely in the best interest of our clients.' } }
      ],
      'contact-protocol': [
        { type: 'header', data: { text: 'Initiate Your Legacy', level: 1 } },
        { type: 'paragraph', data: { text: 'Whether you are seeking to acquire a trophy asset in Palm Jumeirah or diversify your commercial portfolio in Downtown Dubai, our professional team is ready to assist.' } },
        { type: 'header', data: { text: 'Direct Communication Channels', level: 2 } },
        { type: 'paragraph', data: { text: 'For immediate consultation, please utilize our secure inquiry form or contact our headquarters directly. All communications are handled with the utmost confidentiality and professionalism.' } },
        { type: 'header', data: { text: 'Global Headquarters', level: 2 } },
        { type: 'paragraph', data: { text: 'Ahmed Kapadia Private Office • Dubai, United Arab Emirates • Available for consultations by appointment Monday through Friday, 9:00 AM - 6:00 PM GST' } }
      ],
      'portfolio': [
        { type: 'header', data: { text: 'Selected Assets of Distinction', level: 1 } },
        { type: 'paragraph', data: { text: 'A curated showcase of Dubai\'s most prestigious real estate opportunities, selected for architectural brilliance and investment potential.' } },
        { type: 'header', data: { text: 'Investment Philosophy', level: 2 } },
        { type: 'paragraph', data: { text: 'Our portfolio represents the pinnacle of luxury real estate in Dubai. Each property is evaluated for its architectural merit, location premium, developer reputation, and long-term appreciation potential.' } },
        { type: 'header', data: { text: 'Browse Our Collection', level: 2 } },
        { type: 'paragraph', data: { text: 'From waterfront penthouses to commercial landmarks, our inventory reflects the diversity and excellence of Dubai\'s real estate market. Contact us for private viewings and detailed investment analysis.' } }
      ]
    };
    
    return contents[slug] || [
      { type: 'header', data: { text: 'Welcome', level: 1 } },
      { type: 'paragraph', data: { text: 'This page is ready to be customized with your content.' } }
    ];
  };

  useEffect(() => {
    loadPageStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)] mb-1">Corporate Pages</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Site Structure Inventory</p>
        </div>
      </div>

      <AdminCard 
        title="Enterprise Configuration Target"
        className="overflow-hidden"
      >
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Accessing Page Modules</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 -mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-subtle)]">
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] w-12">Portal</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Configuration Target</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                  <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {corePages.map((page) => {
                  const status = pages[page.slug] || { exists: false, published: false };
                  return (
                    <tr key={page.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--color-gold)] border border-[var(--border-subtle)] group-hover:border-[var(--color-gold)]/30 transition-all">
                          <page.icon className="w-5 h-5" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-bold text-[var(--text-main)] mb-0.5">{page.title}</p>
                          <p className="text-[10px] text-[var(--text-muted)] max-w-md line-clamp-1">{page.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {status.exists ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${status.published ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                            <CheckCircle className="w-2.5 h-2.5 mr-1" />
                            {status.published ? 'Live' : 'Draft'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                            Not Initialized
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {status.exists && (
                            <Link
                              href={`/page/${page.slug}`}
                              target="_blank"
                              className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-primary-500 transition-all"
                              title="View Live"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/pages/edit/${page.slug}`}
                            className="btn-premium inline-flex items-center space-x-2 py-1.5 px-4"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Modify</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
