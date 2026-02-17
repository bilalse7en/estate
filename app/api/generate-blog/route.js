import { NextResponse } from 'next/server';
import { generateBlogWithAI } from '@/lib/ai/groq';

export async function POST(request) {
  try {
    const { topic, keywords } = await request.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const result = await generateBlogWithAI(topic, keywords || []);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: result.data
    });
  } catch (error) {
    console.error('Blog generation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
