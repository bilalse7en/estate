'use client';

import React from 'react';

export default function AdminCard({ title, children, actions, className = '', footer }) {
  return (
    <div className={`admin-card flex flex-col ${className}`}>
      {/* Card Header (Optional) */}
      {(title || actions) && (
        <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
          {title && (
            <h3 className="text-sm font-bold text-[var(--text-main)] leading-none truncate">
              {title}
            </h3>
          )}
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className="flex-1 p-4">
        {children}
      </div>

      {/* Card Footer (Optional) */}
      {footer && (
        <div className="px-4 py-2 bg-[var(--bg-tertiary)]/10 border-t border-[var(--border-subtle)]">
          {footer}
        </div>
      )}
    </div>
  );
}
