import { createClient } from '@/lib/supabase/server';
import { FileText, Inbox, TrendingUp, Users } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: blogsCount } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true });

  const { count: formsCount } = await supabase
    .from('client_forms')
    .select('*', { count: 'exact', head: true });

  const stats = [
    { label: 'Total Blogs', value: blogsCount || 0, icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Client Forms', value: formsCount || 0, icon: Inbox, color: 'from-green-500 to-green-600' },
    { label: 'Published Posts', value: blogsCount || 0, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Users', value: '25+', icon: Users, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-main)] mb-2">Dashboard</h1>
        <p className="text-[var(--text-muted)]">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass p-6 rounded-2xl hover:shadow-2xl transition-all border border-[var(--glass-border)] group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
                <stat.icon className="w-6 h-6 text-white stroke-[2]" />
              </div>
              <span className="text-3xl font-bold text-[var(--text-main)] font-display">{stat.value}</span>
            </div>
            <p className="text-[var(--text-muted)] font-medium text-sm uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass p-8 rounded-2xl border border-[var(--glass-border)]">
        <h2 className="text-2xl font-display font-bold text-[var(--text-main)] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/admin/blogs/new"
            className="p-8 border-2 border-dashed border-[var(--glass-border)] rounded-2xl hover:border-primary-500 hover:bg-primary-500/5 transition-all text-center group"
          >
            <FileText className="w-12 h-12 text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-[var(--text-main)] text-lg">Create New Blog Post</h3>
            <p className="text-[var(--text-muted)] text-sm mt-2">Start writing with Editor.js</p>
          </a>
          <a
            href="/admin/forms"
            className="p-8 border-2 border-dashed border-[var(--glass-border)] rounded-2xl hover:border-primary-500 hover:bg-primary-500/5 transition-all text-center group"
          >
            <Inbox className="w-12 h-12 text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-[var(--text-main)] text-lg">View Client Inquiries</h3>
            <p className="text-[var(--text-muted)] text-sm mt-2">Manage form submissions</p>
          </a>
        </div>
      </div>
    </div>
  );
}
