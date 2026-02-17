import { createClient } from '@/lib/supabase/server';
import RespondClient from './RespondClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RespondPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  
  if (!supabase) return notFound();

  const { data: inquiry, error } = await supabase
    .from('client_forms')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !inquiry) {
    return notFound();
  }

  return <RespondClient inquiry={inquiry} />;
}
