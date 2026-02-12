import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Secret token for preview mode (in production, use environment variable)
const PREVIEW_TOKEN = process.env.PREVIEW_TOKEN || 'preview-secret-2024';

export async function POST(request) {
  try {
    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Verify blog exists
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('id, slug, title, published')
      .eq('slug', slug)
      .single();

    if (error || !blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Generate preview URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const previewUrl = `${baseUrl}/blog/${slug}?preview=true&token=${PREVIEW_TOKEN}`;

    return NextResponse.json({
      success: true,
      previewUrl,
      blog: {
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        published: blog.published,
      },
    });
  } catch (error) {
    console.error('Preview API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
