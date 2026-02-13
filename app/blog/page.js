import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate, calculateReadTime } from '@/lib/utils';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Blog - Ahmed Kapadia Real Estate',
  description: 'Latest insights, market trends, and expert advice on Dubai real estate investment',
  keywords: 'Dubai real estate blog, property investment insights, luxury real estate news, market trends',
  openGraph: {
    title: 'Real Estate Insights Blog',
    description: 'Expert advice and market trends from Dubai\'s premium real estate sector',
    url: 'https://ahmedkapadia.com/blog',
    siteName: 'Ahmed Kapadia Real Estate',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let blogs = [];
  let error = null;

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      blogs = data || [];
      error = fetchError;
    }
  } catch (e) {
    console.warn('Supabase not available during blog page build');
  }

  const featuredBlog = blogs?.[0]; // Most recent blog as featured
  const otherBlogs = blogs?.slice(1) || [];

  return (
    <div className="min-h-screen py-24 px-4 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-[var(--text-main)] mb-4 leading-tight tracking-tight">
            Real Estate <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Expert advice and market trends from Dubai's premium real estate sector
          </p>
        </div>

        {error || !blogs || blogs.length === 0 ? (
          <div className="text-center py-20 glass p-12 rounded-3xl border border-[var(--glass-border)]">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-primary-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-[var(--text-main)] mb-3">
                Coming Soon
              </h2>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                We're preparing exclusive insights into Dubai's luxury real estate market. Check back soon for expert advice and market analysis.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Blog */}
            {featuredBlog && (
              <div className="mb-20">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                    Featured Article
                  </span>
                </div>
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="group glass rounded-3xl overflow-hidden border border-[var(--glass-border)] hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl block"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    {featuredBlog.featured_image && (
                      <div className="relative h-80 md:h-full overflow-hidden">
                        <img
                          src={featuredBlog.featured_image}
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[var(--bg-main)] to-transparent opacity-60" />
                      </div>
                    )}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                        <span className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-primary-500" />
                          <span>{formatDate(featuredBlog.created_at)}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-primary-500" />
                          <span>{calculateReadTime(featuredBlog.content)}</span>
                        </span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-main)] mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                        {featuredBlog.title}
                      </h2>
                      
                      {featuredBlog.excerpt && (
                        <p className="text-[var(--text-muted)] text-lg mb-6 leading-relaxed line-clamp-3">
                          {featuredBlog.excerpt}
                        </p>
                      )}
                      
                      <span className="text-primary-600 dark:text-primary-400 font-bold group-hover:translate-x-2 inline-block transition-transform uppercase tracking-wider text-sm">
                        Read Full Article →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Other Blogs Grid */}
            {otherBlogs.length > 0 && (
              <>
                <h2 className="text-3xl font-display font-bold text-[var(--text-main)] mb-8">
                  Latest Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherBlogs.map((blog, index) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="group glass rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[var(--glass-border)] hover:border-primary-500/30 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {blog.featured_image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={blog.featured_image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
                        
                        <span className="text-primary-600 dark:text-primary-400 font-semibold group-hover:translate-x-2 inline-block transition-transform uppercase tracking-wider text-sm">
                          Read More →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
