import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { calculateReadTime, formatDate } from '@/lib/utils';
import SocialShare from '@/components/blog/SocialShare';
import TableOfContents from '@/components/blog/TableOfContents';
import RelatedPosts from '@/components/blog/RelatedPosts';
import PreviewBanner from '@/components/blog/PreviewBanner';

// Secret token for preview mode (in production, use environment variable)
const PREVIEW_TOKEN = process.env.PREVIEW_TOKEN || 'preview-secret-2024';

export async function generateMetadata({ params }) {
  const { slug } = await params;
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

export default async function BlogDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const search = await searchParams;
  const supabase = await createClient();
  
  // Check for preview mode
  const isPreview = search?.preview === 'true' && search?.token === PREVIEW_TOKEN;
  
  // Fetch blog with appropriate published filter
  const query = supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug);
  
  // Only filter by published if not in preview mode
  if (!isPreview) {
    query.eq('published', true);
  }
  
  const { data: blog } = await query.single();

  if (!blog) {
    notFound();
  }

  // Render Editor.js content with IDs for TOC
  const renderEditorJsContent = (content) => {
    if (!content || !content.blocks) return null;

    let headingIndex = 0;

    return content.blocks.map((block, index) => {
      switch (block.type) {
        case 'header':
          const HeaderTag = `h${block.data.level}`;
          const headingId = `heading-${headingIndex++}`;
          return (
            <HeaderTag 
              key={index} 
              id={headingId}
              className="blog-heading font-display font-bold text-[var(--text-main)] scroll-mt-24"
              style={{
                fontSize: block.data.level === 2 ? '2rem' : block.data.level === 3 ? '1.5rem' : '1.25rem',
                marginTop: block.data.level === 2 ? '3rem' : '2rem',
                marginBottom: '1rem',
              }}
            >
              {block.data.text}
            </HeaderTag>
          );
        case 'paragraph':
          return (
            <p 
              key={index} 
              className="blog-paragraph mb-6 text-lg leading-relaxed text-[var(--text-main)]" 
              dangerouslySetInnerHTML={{ __html: block.data.text }} 
            />
          );
        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag 
              key={index} 
              className={`blog-list mb-6 ml-6 space-y-2 text-lg text-[var(--text-main)] ${
                block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'
              }`}
            >
              {block.data.items.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ListTag>
          );
        case 'image':
          return (
            <figure key={index} className="blog-image my-10">
              <img 
                src={block.data.file.url} 
                alt={block.data.caption || ''} 
                className="w-full rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300" 
              />
              {block.data.caption && (
                <figcaption className="mt-4 text-center text-sm text-[var(--text-muted)] italic">
                  {block.data.caption}
                </figcaption>
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

  const readTime = calculateReadTime(blog.content);

  return (
    <>
      {/* Preview Banner */}
      {isPreview && !blog.published && <PreviewBanner />}

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className={`min-h-screen bg-[var(--bg-main)] ${isPreview && !blog.published ? 'pt-36' : 'pt-24'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog Link */}
          <Link 
            href="/blog"
            className="inline-flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Blog</span>
          </Link>

          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-[var(--text-muted)] mb-8">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[var(--text-main)]">{blog.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Featured Image */}
              {blog.featured_image && (
                <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={blog.featured_image} 
                    alt={blog.title}
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                </div>
              )}

              {/* Blog Header */}
              <header className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[var(--text-main)] mb-6 leading-tight">
                  {blog.title}
                </h1>
                
                {blog.excerpt && (
                  <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-8 italic border-l-4 border-primary-500 pl-6">
                    {blog.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-muted)]">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary-500" />
                    <span className="font-medium">Ahmed Kapadia</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <time dateTime={blog.created_at}>
                      {formatDate(blog.created_at)}
                    </time>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <span>{readTime}</span>
                  </div>
                </div>

                {/* Social Share */}
                <div className="mt-8 pt-8 border-t border-[var(--glass-border)]">
                  <SocialShare 
                    url={`https://ahmedkapadia.com/blog/${slug}`}
                    title={blog.title}
                    description={blog.excerpt}
                  />
                </div>
              </header>

              {/* Blog Content */}
              <div className="blog-content prose prose-lg max-w-none">
                {renderEditorJsContent(blog.content)}
              </div>

              {/* Social Share Bottom */}
              <div className="mt-12 pt-8 border-t border-[var(--glass-border)]">
                <p className="text-[var(--text-muted)] mb-4">Share this article</p>
                <SocialShare 
                  url={`https://ahmedkapadia.com/blog/${slug}`}
                  title={blog.title}
                  description={blog.excerpt}
                />
              </div>

              {/* Related Posts */}
              <RelatedPosts currentSlug={slug} />
            </div>

            {/* Sidebar - Table of Contents */}
            <aside className="lg:col-span-4">
              <TableOfContents content={blog.content} />
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
