'use client';

import { useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import { deleteMedia } from '@/lib/actions/media-actions';
import { formatDate } from '@/lib/utils';
import MediaUploader from '@/components/admin/MediaUploader';
import { useToast } from '@/components/ui/ToastProvider';
import { Upload, Image, Check, Copy, ExternalLink, Trash2 } from 'lucide-react';

export default function MediaLibraryClient({ initialMedia }) {
  const { addToast } = useToast();
  const [media, setMedia] = useState(initialMedia);
  const [showUploader, setShowUploader] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleUploadSuccess = (newMedia) => {
    setMedia([newMedia, ...media]);
    setShowUploader(false);
    addToast('Media uploaded successfully', 'success');
  };

  const handleDelete = async (mediaId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setDeleting(mediaId);
    const result = await deleteMedia(mediaId);
    setDeleting(null);

    if (result.success) {
      setMedia(media.filter(m => m.id !== mediaId));
      addToast('Media deleted successfully', 'success');
    } else {
      addToast('Error deleting media: ' + result.error, 'error');
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)] mb-1">Media Library</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">{media.length} Items Total</p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="btn-premium space-x-2"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Upload Section */}
      {showUploader && (
        <AdminCard 
          title="Upload New Image" 
          actions={
            <button
              onClick={() => setShowUploader(false)}
              className="text-xs font-bold text-[var(--text-muted)] hover:text-red-500 transition-colors"
            >
              Cancel
            </button>
          }
        >
          <MediaUploader onUploadSuccess={handleUploadSuccess} />
        </AdminCard>
      )}

      {/* Media Content */}
      <AdminCard 
        title="Asset Inventory"
        className="overflow-hidden"
      >
        {media.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
              <Image className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">No media found</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">Start by uploading your first asset</p>
            <button
              onClick={() => setShowUploader(true)}
              className="btn-glass text-[10px] px-4 py-1.5"
            >
              Upload Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 -mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-subtle)]">
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Preview</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Metadata</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Storage</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Author</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Timestamp</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {media.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setPreviewImage(item.public_url)}
                        className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--color-gold)] transition-all focus-ring"
                      >
                        <img 
                          src={item.public_url} 
                          alt={item.original_filename}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-[180px]">
                        <p className="text-xs font-bold text-[var(--text-main)] truncate" title={item.original_filename}>
                          {item.original_filename}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono truncate opacity-60 mt-0.5">
                          {item.mime_type}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-[var(--text-muted)]">
                        {formatFileSize(item.file_size)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-[var(--text-main)]">
                        {item.uploader_name || 'System'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-[var(--text-muted)]">
                        {formatDate(item.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleCopyUrl(item.public_url, item.id)}
                          className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--color-gold)] transition-all focus-ring"
                          title="Copy Link"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={item.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--color-gold)] transition-all focus-ring"
                          title="View"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="p-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-500 transition-all focus-ring disabled:opacity-30"
                          title="Purge"
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

      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-12"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-5xl w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-4">
               <button
                onClick={() => setPreviewImage(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-white/20"
              >
                ESC TO CLOSE
              </button>
            </div>
            <div className="flex-1 bg-black/40 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center group relative">
              <img 
                src={previewImage} 
                alt="Preview"
                className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
