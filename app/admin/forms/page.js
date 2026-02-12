import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import AdminCard from '@/components/admin/AdminCard';
import { Mail, Phone, Home, Calendar, Inbox } from 'lucide-react';

export default async function AdminFormsPage() {
  const supabase = await createClient();
  
  const { data: forms, error } = await supabase
    .from('client_forms')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)] mb-1">Inquiry Terminal</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Client Communication Feed</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase px-2 py-1 bg-[var(--bg-tertiary)] rounded border border-[var(--border-subtle)]">
            Total: {forms?.length || 0}
          </span>
        </div>
      </div>

      {error || !forms || forms.length === 0 ? (
        <AdminCard title="Inquiry Status">
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
              <Inbox className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">Queue is clear</h3>
            <p className="text-xs text-[var(--text-muted)]">Passive listening active for new client transmissions</p>
          </div>
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {forms.map((form) => (
            <AdminCard 
              key={form.id}
              className="group"
            >
              <div className="flex flex-wrap items-start justify-between mb-4 border-b border-[var(--border-subtle)] pb-3 -mx-4 px-4 bg-[var(--bg-tertiary)]/30">
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-tight">
                    {form.name}
                  </h3>
                  <div className="flex items-center text-[10px] text-[var(--text-muted)] font-bold mt-1 uppercase">
                    <Calendar className="w-3 h-3 mr-1 opacity-50" />
                    {formatDate(form.created_at)}
                  </div>
                </div>
                <span className="px-1.5 py-0.5 bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20 rounded text-[9px] font-bold uppercase tracking-widest">
                  Transmission
                </span>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center space-x-3 group/item">
                  <div className="w-6 h-6 rounded bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-subtle)] group-hover/item:border-[var(--color-gold)]/30 transition-colors">
                    <Mail className="w-3 h-3 text-[var(--text-muted)]" />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-main)] truncate">{form.email}</span>
                </div>
                <div className="flex items-center space-x-3 group/item">
                  <div className="w-6 h-6 rounded bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-subtle)] group-hover/item:border-[var(--color-gold)]/30 transition-colors">
                    <Phone className="w-3 h-3 text-[var(--text-muted)]" />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-main)]">{form.phone}</span>
                </div>
                <div className="p-2 bg-[var(--bg-tertiary)]/50 rounded-lg border border-[var(--border-subtle)] group/interest">
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                    <Home className="w-3 h-3 opacity-50" />
                    <span>Interest Spectrum</span>
                  </div>
                  <p className="text-xs font-bold text-[var(--text-main)] line-clamp-1">{form.property_interest}</p>
                </div>
              </div>

              {form.message && (
                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] mt-1.5 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Direct Message</p>
                      <p className="text-xs leading-relaxed text-[var(--text-main)]/80 italic font-medium">"{form.message}"</p>
                    </div>
                  </div>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
