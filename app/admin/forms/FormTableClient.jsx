'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, Home, Trash2, Reply, CheckCircle, Clock } from 'lucide-react';
import Pagination from '@/components/admin/Pagination';
import AdminCard from '@/components/admin/AdminCard';
import { deleteInquiry } from '@/lib/actions/form-actions';
import { useToast } from '@/components/ui/ToastProvider';

export default function FormTableClient({ initialForms }) {
  const { addToast } = useToast();
  const [forms, setForms] = useState(initialForms || []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(forms.length / itemsPerPage);
  const currentItems = forms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    const result = await deleteInquiry(id);
    if (result.success) {
      setForms(forms.filter(f => f.id !== id));
      addToast('Inquiry deleted successfully', 'success');
    } else {
      addToast('Error deleting inquiry: ' + result.error, 'error');
    }
  };

  return (
    <AdminCard title="Inquiry Terminal" className="overflow-hidden">
      {forms.length === 0 ? (
        <div className="py-12 text-center text-[var(--text-muted)]">
          <p className="text-sm font-bold">No inquiries found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-subtle)]">
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Source / Contact</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Interest Spectrum</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Timestamp</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {currentItems.map((form) => (
                  <tr key={form.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-tight">{form.name}</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <Mail className="w-2.5 h-2.5 text-primary-500" />
                          <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[150px]">{form.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Home className="w-3 h-3 text-[var(--color-gold)] opacity-60" />
                        <span className="text-[11px] font-bold text-[var(--text-main)] truncate max-w-[200px]">{form.property_interest}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                        form.status === 'reviewed' 
                          ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {form.status === 'reviewed' ? (
                          <><CheckCircle className="w-2.5 h-2.5 mr-1" /> Reviewed</>
                        ) : (
                          <><Clock className="w-2.5 h-2.5 mr-1" /> Pending</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-bold uppercase tracking-tighter text-[var(--text-muted)]">
                      {formatDate(form.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link 
                          href={`/admin/forms/respond/${form.id}`}
                          className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-primary-500 transition-all focus-ring"
                          title="Respond"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(form.id)}
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
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={forms.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </AdminCard>
  );
}

