'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4 border-t border-[var(--border-subtle)]">
      <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">
        Showing <span className="text-[var(--text-main)]">{startItem}</span> to <span className="text-[var(--text-main)]">{endItem}</span> of <span className="text-[var(--text-main)]">{totalItems}</span> results
      </div>
      
      <div className="flex items-center space-x-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50 text-[var(--text-muted)] hover:text-primary-500 disabled:opacity-30 disabled:hover:text-[var(--text-muted)] transition-all"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50 text-[var(--text-muted)] hover:text-primary-500 disabled:opacity-30 disabled:hover:text-[var(--text-muted)] transition-all"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1 px-2">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                currentPage === page
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-[var(--bg-tertiary)]/30 text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-primary-500/50 hover:text-primary-500'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50 text-[var(--text-muted)] hover:text-primary-500 disabled:opacity-30 disabled:hover:text-[var(--text-muted)] transition-all"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50 text-[var(--text-muted)] hover:text-primary-500 disabled:opacity-30 disabled:hover:text-[var(--text-muted)] transition-all"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
