'use client';

import { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react';

export default function SocialShare({ url, title, description }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] hover:border-primary-500/50 transition-all duration-300"
        aria-label="Share this post"
      >
        <Share2 className="w-5 h-5" />
        <span className="font-medium">Share</span>
      </button>

      {showMenu && (
        <div className="absolute top-full mt-2 right-0 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-2xl p-3 space-y-2 z-50 min-w-[200px]">
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors group"
          >
            <Twitter className="w-5 h-5 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
            <span className="text-[var(--text-main)] font-medium">Twitter</span>
          </a>

          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors group"
          >
            <Linkedin className="w-5 h-5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
            <span className="text-[var(--text-main)] font-medium">LinkedIn</span>
          </a>

          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors group"
          >
            <Facebook className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" />
            <span className="text-[var(--text-main)] font-medium">Facebook</span>
          </a>

          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors group w-full"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-green-500 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-5 h-5 text-[var(--text-muted)] group-hover:scale-110 transition-transform" />
                <span className="text-[var(--text-main)] font-medium">Copy Link</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Close menu when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
