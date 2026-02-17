import { createClient } from '@/lib/supabase/server';
import AdminCard from '@/components/admin/AdminCard';
import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import BlogTableClient from './BlogTableClient';

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
  let blogs = [];
  let error = null;

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      blogs = data || [];
      error = fetchError;
    }
  } catch (e) {
    error = e;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)] mb-1">Blog Management</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Content Inventory</p>
        </div>
        <Link href="/admin/blogs/new" className="btn-premium space-x-2">
          <Plus className="w-3.5 h-3.5" />
          <span>New Publication</span>
        </Link>
      </div>

      <BlogTableClient initialBlogs={blogs} />
    </div>
  );
}
