import { createClient } from '@/lib/supabase/server';

export default async function sitemap() {
  const supabase = await createClient();
  
  // Fetch all published blogs
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, updated_at, created_at')
    .eq('published', true);

  const blogEntries = (blogs || []).map((blog) => ({
    url: `https://ahmedkapadia.com/blog/${blog.slug}`,
    lastModified: blog.updated_at || blog.created_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://ahmedkapadia.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://ahmedkapadia.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://ahmedkapadia.com/submit-form',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogEntries,
  ];
}
