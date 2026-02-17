'use client';

import { useState } from 'react';
import { Trash2, Loader2, Database, CheckCircle } from 'lucide-react';
import AdminCard from '@/components/admin/AdminCard';
import { useToast } from '@/components/ui/ToastProvider';
import { runCleanupOldData } from '@/lib/actions/cleanup-actions';

export default function CleanupPanel() {
  const { addToast } = useToast();
  const [cleaning, setCleaning] = useState(false);
  const [lastCleanup, setLastCleanup] = useState(null);

  const handleCleanup = async () => {
    if (!confirm('This will permanently delete all inquiries and their attachments older than 1 year. Website images will be protected. Continue?')) {
      return;
    }

    setCleaning(true);
    try {
      const result = await runCleanupOldData();
      
      if (result.success) {
        setLastCleanup({
          date: new Date(),
          inquiries: result.deletedInquiries,
          media: result.deletedMedia
        });
        addToast(
          `Cleanup complete! Removed ${result.deletedInquiries} old inquiries and ${result.deletedMedia} files.`,
          'success'
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      addToast('Cleanup failed: ' + error.message, 'error');
    } finally {
      setCleaning(false);
    }
  };

  return (
    <AdminCard title="Storage Optimization">
      <div className="space-y-6">
        <div className="flex items-start space-x-4 p-4 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)]">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Database className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[var(--text-main)] mb-2">Automatic Data Cleanup</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Removes inquiries and their attachments older than 1 year to optimize your free database tier. 
              Website images are automatically protected and will never be deleted.
            </p>
          </div>
        </div>

        {lastCleanup && (
          <div className="flex items-start space-x-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-green-600 mb-1">Last Cleanup Successful</p>
              <p className="text-[10px] text-[var(--text-muted)]">
                {new Date(lastCleanup.date).toLocaleString()} • 
                Removed {lastCleanup.inquiries} inquiries & {lastCleanup.media} files
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleCleanup}
          disabled={cleaning}
          className="w-full btn-glass py-3 space-x-2"
        >
          {cleaning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">Cleaning...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Run Cleanup Now</span>
            </>
          )}
        </button>

        <p className="text-[9px] text-[var(--text-muted)] italic px-2">
          * This process is safe and reversible through database backups. Run monthly for optimal storage management.
        </p>
      </div>
    </AdminCard>
  );
}
