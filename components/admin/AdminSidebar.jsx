'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Inbox, Settings, Home } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/blogs', icon: FileText, label: 'Blog Posts' },
    { href: '/admin/forms', icon: Inbox, label: 'Client Forms' },
    { href: '/admin/settings', icon: Settings, label: 'Site Settings' },
    { href: '/', icon: Home, label: 'Back to Site' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-[var(--glass-border)] hidden lg:block z-40">
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-display font-bold text-[var(--text-main)] tracking-tight">Admin Panel</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Content Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t border-[var(--glass-border)]">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            Ahmed Kapadia Real Estate
          </p>
        </div>
      </div>
    </aside>
  );
}
