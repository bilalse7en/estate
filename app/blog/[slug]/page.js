import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const supabase = await createClient();
  
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  const excerpt = blog.excerpt || 'Premium insights into Dubai luxury real estate market and investment opportunities.';
  const imageUrl = blog.featured_image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200';

  return {
    title: `${blog.title} | Ahmed Kapadia Real Estate Blog`,
    description: excerpt.substring(0, 160),
    keywords: 'Dubai real estate, luxury property, investment, Ahmed Kapadia, market insights',
    authors: [{ name: 'Ahmed Kapadia' }],
    openGraph: {
      title: blog.title,
      description: excerpt,
      url: `https://ahmedkapadia.com/blog/${slug}`,
      siteName: 'Ahmed Kapadia Real Estate',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at || blog.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: excerpt,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = params;
  const supabase = await createClient();
  
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!blog) {
    notFound();
  }

  // Render Editor.js content
  const renderEditorJsContent = (content) => {
    if (!content || !content.blocks) return null;

    return content.blocks.map((block, index) => {
      switch (block.type) {
        case 'header':
          const HeaderTag = `h${block.data.level}`;
          return (
            <HeaderTag key={index} className="mb-6 font-display font-bold text-[var(--text-main)]">
              {block.data.text}
            </HeaderTag>
          );
        case 'paragraph':
          return (
            <p key={index} className="mb-6 text-base leading-relaxed text-[var(--text-main)]" dangerouslySetInnerHTML={{ __html: block.data.text }} />
          );
        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index} className="mb-6 ml-6 space-y-2 text-base text-[var(--text-main)] list-disc">
              {block.data.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ListTag>
          );
        case 'image':
          return (
            <figure key={index} className="mb-8">
              <img src={block.data.file.url} alt={block.data.caption || ''} className="w-full rounded-2xl shadow-xl" />
              {block.data.caption && (
                <figcaption className="mt-3 text-center text-sm text-[var(--text-muted)] italic">{block.data.caption}</figcaption>
              )}
            </figure>
          );
        default:
          return null;
      }
    });
  };

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || '',
    image: blog.featured_image || '',
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      '@type': 'Person',
      name: 'Ahmed Kapadia',
      url: 'https://ahmedkapadia.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ahmed Kapadia Real Estate',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ahmedkapadia.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ahmedkapadia.com/blog/${slug}`,
    },
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-[var(--bg-main)] py-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Featured Image */}
          {blog.featured_image && (
            <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={blog.featured_image} 
                alt={blog.title}
                className="w-full h-[500px] object-cover"
              />
            </div>
          )}

          {/* Blog Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-main)] mb-6 leading-tight">
              {blog.title}
            </h1>
            
            {blog.excerpt && (
              <p className="text-base text-[var(--text-muted)] leading-relaxed mb-8 italic">
                {blog.excerpt}
              </p>
            )}

            <div className="flex items-center space-x-6 text-sm text-[var(--text-muted)]">
              <time dateTime={blog.created_at}>
                {new Date(blog.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              <span>•</span>
              <span>Ahmed Kapadia</span>
            </div>
          </header>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none">
            {renderEditorJsContent(blog.content)}
          </div>
        </div>
      </article>
    </>
  );
}
