'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Inbox, Settings, Home, Image } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/blogs', icon: FileText, label: 'Blog Posts' },
    { href: '/admin/media', icon: Image, label: 'Media Library' },
    { href: '/admin/forms', icon: Inbox, label: 'Client Forms' },
    { href: '/admin/settings', icon: Settings, label: 'Site Settings' },
    { href: '/', icon: Home, label: 'Back to Site' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] hidden lg:block z-40">
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="mb-6 px-2">
          <h2 className="text-lg font-display font-bold text-[var(--text-main)] tracking-tight">Admin</h2>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Workspace</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all focus-ring ${
                  isActive
                    ? 'bg-[var(--color-gold)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-main)]'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`} />
                <span className="font-semibold text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-[var(--border-subtle)]">
          <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-bold opacity-70">
            v1.2 • Ahmed Kapadia
          </p>
        </div>
      </div>
    </aside>
  );
}
