import { createClient } from '@/lib/supabase/server';
import AdminCard from '@/components/admin/AdminCard';
import Link from 'next/link';
import { FileText, Inbox, TrendingUp, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: blogsCount } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true });

  const { count: formsCount } = await supabase
    .from('client_forms')
    .select('*', { count: 'exact', head: true });

  const stats = [
    { label: 'Total Blogs', value: blogsCount || 0, icon: FileText, color: 'text-blue-500' },
    { label: 'Client Inquiries', value: formsCount || 0, icon: Inbox, color: 'text-green-500' },
    { label: 'Performance', value: 'High', icon: TrendingUp, color: 'text-[var(--color-gold)]' },
    { label: 'Network', value: 'Active', icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-xl font-display font-bold text-[var(--text-main)] mb-1">Dashboard</h1>
        <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Operational Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="admin-card p-4 flex items-center space-x-4 h-full"
          >
            <div className={`w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-strong)] shadow-inner`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-[var(--text-main)] leading-none mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <AdminCard 
          title="Command Center" 
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/blogs/new"
              className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20 hover:bg-[var(--hover-bg)] hover:border-[var(--color-gold)] transition-all group focus-ring"
            >
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-[var(--color-gold)]" />
                <h3 className="font-bold text-[var(--text-main)] text-sm">New Publication</h3>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-medium font-mono opacity-70">Initialize a new blog entry with Editor.js engine.</p>
            </Link>
            
            <Link
              href="/admin/forms"
              className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20 hover:bg-[var(--hover-bg)] hover:border-[var(--color-gold)] transition-all group focus-ring"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Inbox className="w-5 h-5 text-[var(--color-gold)]" />
                <h3 className="font-bold text-[var(--text-main)] text-sm">Inquiry Review</h3>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-medium font-mono opacity-70">Process recent client submissions and leads.</p>
            </Link>
          </div>
        </AdminCard>

        {/* System Info */}
        <AdminCard title="System Diagnostics">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Status</span>
              <span className="text-[10px] font-bold text-green-500 uppercase px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">Optimal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Database</span>
              <span className="text-[10px] font-bold text-[var(--text-main)]">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Storage</span>
              <span className="text-[10px] font-bold text-[var(--text-main)]">Encrypted</span>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
