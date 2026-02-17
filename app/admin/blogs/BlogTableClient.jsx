'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Pagination from '@/components/admin/Pagination';
import AdminCard from '@/components/admin/AdminCard';

export default function BlogTableClient({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const currentItems = blogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <AdminCard title="Post Inventory" className="overflow-hidden">
      {blogs.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">No publications yet</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Initialize your first post to begin circulation</p>
          <Link href="/admin/blogs/new" className="btn-glass text-[10px] px-4 py-1.5">
            Initialize Post
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-4">
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
                {currentItems.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group">
                    <td className="px-4 py-3 text-xs">
                      <div className="max-w-md">
                        <p className="font-bold text-[var(--text-main)] truncate mb-0.5">{blog.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono opacity-60">/{blog.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                        blog.published ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-bold uppercase tracking-tighter text-[var(--text-muted)]">
                      {formatDate(blog.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <a href={`/blog/${blog.slug}`} target="_blank" className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-primary-500"><Eye className="w-3.5 h-3.5" /></a>
                        <Link href={`/admin/blogs/edit/${blog.id}`} className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-blue-500"><Edit className="w-3.5 h-3.5" /></Link>
                        <button className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={blogs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </AdminCard>
  );
}
