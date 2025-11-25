import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini, extractJSON } from '@/lib/gemini';
import { buildPrompt, parseGeneratedPlan } from '@/lib/prompt-builder';
import type { GenerateRequest, GenerateResponse } from '@/types';

interface ExtendedGenerateRequest extends GenerateRequest {
  customPrompt?: string;
}

interface ExtendedGenerateResponse extends GenerateResponse {
  rawResponse?: string;
  usedPrompt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExtendedGenerateRequest = await request.json();
    const { projectDetails, customPrompt } = body;

    // Validate required fields
    if (!projectDetails.websiteType) {
      return NextResponse.json<ExtendedGenerateResponse>(
        { success: false, error: 'Website type is required' },
        { status: 400 }
      );
    }

    // Use custom prompt if provided, otherwise build from details
    const prompt = customPrompt || buildPrompt(projectDetails);

    // Generate with Gemini
    const rawResponse = await generateWithGemini(prompt);

    // Try to extract and parse JSON from response
    try {
      const jsonStr = extractJSON(rawResponse);
      const plan = parseGeneratedPlan(jsonStr, projectDetails);

      return NextResponse.json<ExtendedGenerateResponse>({
        success: true,
        plan,
        rawResponse,
        usedPrompt: prompt,
      });
    } catch (parseError) {
      // If JSON parsing fails, return raw response for display
      console.error('Error parsing JSON from response:', parseError);
      return NextResponse.json<ExtendedGenerateResponse>({
        success: false,
        error: 'Could not parse JSON from AI response. See raw response below.',
        rawResponse,
        usedPrompt: prompt,
      });
    }
  } catch (error) {
    console.error('Error generating plan:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json<ExtendedGenerateResponse>(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

