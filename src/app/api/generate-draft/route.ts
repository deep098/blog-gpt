import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { niche, audience, title, outline } = await request.json();

    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      );
    }

    const prompt = `Write a complete, high-quality blog post for the niche: "${niche}"${
      audience ? ` targeting ${audience}` : ''
    }${title ? ` with the title: "${title}"` : ''}${
      outline ? `\n\nUse this outline as a guide:\n${outline}` : ''
    }.

    Requirements:
    - 1000-1500 words
    - Engaging introduction with a strong hook
    - Well-structured sections with clear subheadings (H2, H3)
    - Actionable tips and practical insights
    - Examples and case studies where relevant
    - Strong conclusion with clear call-to-action
    - SEO-optimized and reader-friendly
    - Professional yet conversational tone
    - Include relevant statistics or data points

    Make it comprehensive, valuable, and ready to publish.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter and content creator who writes engaging, high-converting blog posts that provide real value to readers and rank well in search engines."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2500, // More tokens for full draft
      temperature: 0.7, // Balanced for quality writing
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      type: 'draft',
      niche,
      audience,
      title,
      wordCount: generatedContent.split(' ').length,
      usage: completion.usage,
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate draft. Please try again.' },
      { status: 500 }
    );
  }
}