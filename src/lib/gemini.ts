import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. AI features will not work.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateWithGemini(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in .env.local');
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash-lite',  // ✅ เปลี่ยนจาก 'gemini-1.5-flash'
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    }
  });
  console.log('prompt', prompt);

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log('response', response);
  console.log('text', text);
  
  return text;
}

export function extractJSON(text: string): string {
  // Try to find JSON in the response
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  
  // Try to find raw JSON object
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return objectMatch[0];
  }
  
  throw new Error('No valid JSON found in response');
}

