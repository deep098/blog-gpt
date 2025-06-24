import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { niche, audience } = await request.json();

    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      );
    }

    const prompt = `Generate 10 engaging blog post title ideas for the niche: "${niche}"${
      audience ? ` targeting ${audience}` : ''
    }. 

    Make the titles:
    - Click-worthy and engaging
    - SEO-friendly
    - Specific and actionable
    - Varied in style (how-to, listicles, questions, case studies, etc.)

    Format as a numbered list with brief explanations for each title.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert content strategist specializing in creating viral and engaging blog post titles that drive traffic and engagement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.8, // Higher creativity for ideas
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      type: 'ideas',
      niche,
      audience,
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
      { error: 'Failed to generate ideas. Please try again.' },
      { status: 500 }
    );
  }
}