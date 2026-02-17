import { createClient } from '@/lib/supabase/server';
import FormTableClient from './FormTableClient';

export const dynamic = 'force-dynamic';

export default async function AdminFormsPage() {
  let forms = [];
  let error = null;

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error: fetchError } = await supabase
        .from('client_forms')
        .select('*')
        .order('created_at', { ascending: false });
      
      forms = data || [];
      error = fetchError;
    }
  } catch (e) {
    error = e;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-center sm:text-left flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)] mb-1">Inquiry Terminal</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Client Communication Feed</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-full border border-[var(--border-subtle)]">
            Active Leads: {forms?.length || 0}
          </span>
        </div>
      </div>

      <FormTableClient initialForms={forms} />
    </div>
  );
}
