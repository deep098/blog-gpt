import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { niche, audience, title } = await request.json();

    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      );
    }

    const prompt = `Create a detailed blog post outline for ${title ? `the title: "${title}"` : `the niche: "${niche}"`}${
      audience ? ` targeting ${audience}` : ''
    }.

    Include:
    - A compelling title (if not provided)
    - Hook for the introduction
    - 4-6 main sections with:
    * Clear subheadings
    * 2-3 bullet points per section
    * Key takeaways
    - Strong conclusion with call-to-action
    - Estimated word count for each section
    - SEO keywords to target

    Make it comprehensive, actionable, and structured for maximum reader engagement.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert content strategist who creates detailed, actionable blog post outlines that ensure comprehensive coverage and reader engagement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.6, // Balanced creativity and structure
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      type: 'outline',
      niche,
      audience,
      title,
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
      { error: 'Failed to generate outline. Please try again.' },
      { status: 500 }
    );
  }
}