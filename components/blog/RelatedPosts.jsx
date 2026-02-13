import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight } from 'lucide-react';

export default async function RelatedPosts({ currentSlug, limit = 3 }) {
  let relatedPosts = [];
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    // Fetch related posts (excluding current post)
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .neq('slug', currentSlug)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    relatedPosts = data || [];
  } catch (error) {
    console.error('RelatedPosts fetch error:', error);
    return null;
  }

  if (!relatedPosts || relatedPosts.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-[var(--glass-border)]">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-[var(--text-main)] mb-2">
          Related Articles
        </h2>
        <p className="text-[var(--text-muted)]">
          Continue exploring insights from Dubai's luxury real estate market
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group glass rounded-2xl overflow-hidden border border-[var(--glass-border)] hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl"
          >
            {post.featured_image && (
              <div className="relative h-40 overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="p-5">
              <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] mb-3">
                <Calendar className="w-3.5 h-3.5 text-primary-500" />
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              </div>

              <h3 className="text-lg font-display font-bold text-[var(--text-main)] mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                {post.title}
              </h3>

              {post.excerpt && (
                <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <span className="inline-flex items-center space-x-1 text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
