'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft, Send, Loader2, MessageSquare, User, 
  Mail, Phone, Home, Calendar, Paperclip, FileText, 
  CheckCircle, Clock, Trash2 
} from 'lucide-react';
import AdminCard from '@/components/admin/AdminCard';
import { useToast } from '@/components/ui/ToastProvider';
import { formatDate, editorJsToHtml } from '@/lib/utils';
import { respondToInquiry } from '@/lib/actions/form-actions';
import MediaUploader from '@/components/admin/MediaUploader';

const EditorJSComponent = dynamic(() => import('@/components/admin/EditorJSComponent'), {
  ssr: false,
  loading: () => (
    <div className="admin-card p-12 bg-[var(--bg-secondary)] min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--color-gold)]" />
    </div>
  ),
});

export default function RespondClient({ inquiry }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [responseContent, setResponseContent] = useState({ blocks: [] });
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleUploadSuccess = (media) => {
    setAttachments([...attachments, media]);
    addToast('Attachment uploaded successfully', 'success');
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (responseContent.blocks.length === 0) {
      addToast('Please draft a response message', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Convert Editor.js to HTML for the email
      const htmlResponse = editorJsToHtml(responseContent);
      
      // Append attachments links to the HTML if any
      let finalHtml = htmlResponse;
      if (attachments.length > 0) {
        finalHtml += `
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-weight: bold; margin-bottom: 10px;">Enclosed Attachments:</p>
            <ul style="list-style: none; padding: 0;">
              ${attachments.map(a => `
                <li style="margin-bottom: 8px;">
                  <a href="${a.public_url}" target="_blank" style="color: #b87333; text-decoration: none; font-size: 14px; border: 1px solid #b8733322; padding: 5px 12px; border-radius: 4px; display: inline-block;">
                    📎 ${a.original_filename || a.filename}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      }

      const formData = new FormData();
      formData.append('id', inquiry.id);
      formData.append('response', finalHtml); // Send as HTML
      formData.append('email', inquiry.email);
      formData.append('name', inquiry.name);
      formData.append('property_interest', inquiry.property_interest);

      const result = await respondToInquiry(formData);

      if (result.success) {
        addToast(result.warning || 'Official response dispatched successfully', result.warning ? 'warning' : 'success');
        router.push('/admin/forms');
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      addToast('Dispatch failure: ' + error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/forms')}
            className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-500 mb-1 transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Return to Terminal</span>
          </button>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)]">Draft Official Response</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-premium space-x-2 px-8 py-3"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="uppercase tracking-widest text-[10px] font-bold">Dispatch Response</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Inquiry Details */}
        <div className="space-y-6">
          <AdminCard title="Inquiry Payload" className="sticky top-24">
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-center bg-[var(--bg-tertiary)]/50 p-3 rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">System Status</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                  inquiry.status === 'responded' 
                    ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                    : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                }`}>
                  {inquiry.status === 'responded' ? <><CheckCircle className="w-2.5 h-2.5 mr-1" /> Responded</> : <><Clock className="w-2.5 h-2.5 mr-1" /> Pending Response</>}
                </span>
              </div>

              {/* Client Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                    <User className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-tighter">Client Identity</p>
                    <p className="text-xs font-bold text-[var(--text-main)]">{inquiry.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-tighter">Email Coordinate</p>
                    <p className="text-xs font-bold text-[var(--text-main)]">{inquiry.email}</p>
                  </div>
                </div>

                {inquiry.phone && (
                  <div className="flex items-center space-x-3 group">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                      <Phone className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-tighter">Communication Line</p>
                      <p className="text-xs font-bold text-[var(--text-main)]">{inquiry.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center border border-[var(--color-gold)]/20">
                    <Home className="w-4 h-4 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-tighter">Interest Spectrum</p>
                    <p className="text-xs font-bold text-[var(--text-main)]">{inquiry.property_interest}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
                <div className="flex items-center space-x-2 mb-3">
                  <MessageSquare className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Received Message</span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--text-main)] italic">
                  "{inquiry.message || 'No message provided'}"
                </p>
              </div>

              <div className="text-center pt-2">
                <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                  Received: {formatDate(inquiry.created_at)}
                </p>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Right: Response Editor & Attachments */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Protocol Draft Interface">
            <div className="space-y-4">
              <label className="admin-label">Official Narrative Output</label>
              <EditorJSComponent
                data={responseContent}
                onChange={setResponseContent}
                editorblock="inquiry-response-editor"
              />
            </div>
          </AdminCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminCard title="Encryption & Attachments">
              <div className="space-y-4">
                <MediaUploader 
                  onUploadSuccess={handleUploadSuccess}
                  id="inquiry-attachment-uploader"
                />
                <p className="text-[9px] text-[var(--text-muted)] italic px-2">
                  * All attachments are indexed and securely shared with the client. Supports: Word, Excel, PDF, and Images.
                </p>
              </div>
            </AdminCard>

            <AdminCard title="Attachment manifest">
              {attachments.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-[var(--text-muted)] space-y-2">
                  <Paperclip className="w-6 h-6 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Zero Attachments Indexed</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] group">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-primary-500" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-[var(--text-main)] truncate max-w-[150px]">
                            {file.original_filename || file.filename}
                          </p>
                          <p className="text-[9px] text-[var(--text-muted)] font-mono">
                            {(file.file_size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeAttachment(file.id)}
                        className="p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}
