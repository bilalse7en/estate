import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import AdminCard from '@/components/admin/AdminCard';
import Link from 'next/link';
import { Plus, FileText, Eye, Edit, Trash2 } from 'lucide-react';

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
      
      blogs = data;
      error = fetchError;
    } else {
      error = new Error('Supabase client could not be initialized. Please check your environment variables.');
    }
  } catch (e) {
    console.error('Error in AdminBlogsPage:', e);
    error = e;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)] mb-1">Blog Management</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Content Inventory</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="btn-premium space-x-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Publication</span>
        </Link>
      </div>

      <AdminCard 
        title="Post Inventory"
        className="overflow-hidden"
      >
        {error || !blogs || blogs.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
              <FileText className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">No publications yet</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">Initialize your first post to begin circulation</p>
            <Link
              href="/admin/blogs/new"
              className="btn-glass text-[10px] px-4 py-1.5"
            >
              Initialize Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 -mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-subtle)]">
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Publication Title</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Visibility</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Date Created</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="max-w-md">
                        <p className="text-xs font-bold text-[var(--text-main)] truncate mb-0.5">{blog.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono opacity-60">/{blog.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                          blog.published
                            ? 'bg-green-500/10 text-green-600 border-green-500/20'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-bold uppercase tracking-tighter text-[var(--text-muted)]">
                      {formatDate(blog.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <a
                          href={`/blog/${blog.slug}${!blog.published ? '?preview=true&token=preview-secret-2024' : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--color-gold)] transition-all focus-ring"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href={`/admin/blogs/edit/${blog.id}`}
                          className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-blue-500 transition-all focus-ring"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-500 transition-all focus-ring"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
