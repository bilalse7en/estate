'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!content || !content.blocks) return;

    // Extract headings from Editor.js content
    const headers = content.blocks
      .filter(block => block.type === 'header')
      .map((block, index) => ({
        id: `heading-${index}`,
        text: block.data.text,
        level: block.data.level,
      }));

    setHeadings(headers);

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    // Observe all headings
    headers.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length < 3) return null; // Only show TOC if there are at least 3 headings

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6">
        <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-4">
          Table of Contents
        </h3>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`group flex items-start text-left w-full py-1 text-sm transition-all duration-200 ${
                  activeId === heading.id
                    ? 'text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <ChevronRight
                  className={`w-4 h-4 mt-0.5 mr-1 flex-shrink-0 transition-transform ${
                    activeId === heading.id ? 'rotate-90 text-primary-600' : 'opacity-0 group-hover:opacity-100'
                  }`}
                />
                <span className="line-clamp-2">{heading.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
