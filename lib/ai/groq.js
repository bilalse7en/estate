/**
 * Free AI Blog Generator using Groq API + Llama 3.3
 * 100% free, 14,400 requests/day, blazing fast
 */

export async function generateBlogWithAI(topic, keywords = []) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('Groq API key not configured. Add GROQ_API_KEY to your .env.local');
    }

    const keywordsText = keywords.length > 0 ? `Focus keywords: ${keywords.join(', ')}` : '';

    const systemPrompt = `You are a professional real estate content writer for Ahmed Kapadia Private Office in Dubai.

Create SEO-optimized blog content that is:
- Professional and authoritative
- 1200-1500 words
- Includes market insights specific to Dubai luxury real estate
- Has natural keyword integration
- Engaging introduction and strong conclusion
- Proper heading structure (H2, H3)
- Actionable insights for high-net-worth individuals

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "title": "Compelling SEO title (max 60 characters)",
  "excerpt": "Engaging meta description (max 160 characters)",
  "content": {
    "blocks": [
      {"type": "header", "data": {"level": 2, "text": "Section Title"}},
      {"type": "paragraph", "data": {"text": "Paragraph content here..."}}
    ]
  },
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const userPrompt = `Write a comprehensive blog post about: "${topic}"

${keywordsText}

Remember to return ONLY valid JSON with the structure specified.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'AI generation failed');
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content;

    if (!generatedText) {
      throw new Error('No content generated');
    }

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response as JSON');
    }

    const blogData = JSON.parse(jsonMatch[0]);
    
    return {
      success: true,
      data: blogData
    };
  } catch (error) {
    console.error('AI Blog Generation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function improveContentWithAI(existingContent, improvement = 'seo') {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('Groq API key not configured');
    }

    let improvementPrompt = '';
    switch (improvement) {
      case 'seo':
        improvementPrompt = 'Optimize this content for SEO while maintaining its professional tone.';
        break;
      case 'expand':
        improvementPrompt = 'Expand this content with more detailed insights and examples.';
        break;
      case 'simplify':
        improvementPrompt = 'Simplify and clarify this content while keeping the key messages.';
        break;
      default:
        improvementPrompt = 'Improve the quality and engagement of this content.';
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content editor.'
          },
          {
            role: 'user',
            content: `${improvementPrompt}\n\nOriginal content:\n${existingContent}\n\nReturn only the improved version.`
          }
        ],
        temperature: 0.5,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error('AI improvement failed');
    }

    const data = await response.json();
    const improvedText = data.choices[0]?.message?.content;

    return {
      success: true,
      data: improvedText
    };
  } catch (error) {
    console.error('AI Content Improvement Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
