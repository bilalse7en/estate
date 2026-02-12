import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate, calculateReadTime } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

export const metadata = {
  title: 'Blog - Ahmed Kapadia Real Estate',
  description: 'Latest insights, market trends, and expert advice on Dubai real estate investment',
};

export default async function BlogPage() {
  const supabase = await createClient();
  
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen py-24 px-4 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-[var(--text-main)] mb-4  leading-tight tracking-tight">
            Real Estate <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Expert advice and market trends from Dubai's premium real estate sector
          </p>
        </div>

        {error || !blogs || blogs.length === 0 ? (
          <div className="text-center py-20 glass p-12 rounded-3xl border border-[var(--glass-border)]">
            <p className="text-[var(--text-muted)] text-lg">No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group glass rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border border-[var(--glass-border)] hover:border-primary-500/30"
              >
                {blog.featured_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-[var(--text-muted)] mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span>{formatDate(blog.created_at)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span>{calculateReadTime(blog.content)}</span>
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-display font-bold text-[var(--text-main)] mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h2>
                  
                  {blog.excerpt && (
                    <p className="text-[var(--text-muted)] line-clamp-3 mb-4 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  )}
                  
                  <span className="text-primary-600 dark:text-primary-400 font-semibold group-hover:translate-x-2 inline-block transition-transform uppercase tracking-wider text-sm" >
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
