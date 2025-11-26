import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini, extractJSON } from '@/lib/gemini';
import { 
  buildFlowchartPrompt, 
  sanitizeMermaidCode,
  type BuildFlowchartPromptOptions,
  type FlowchartOutput 
} from '@/lib/flowchart-prompt';
import type { WebsiteType } from '@/app/flowchart/WebsiteType';

// ===========================================
// Types
// ===========================================

interface FlowchartRequest {
  websiteType: WebsiteType;
  selectedFeatures: string[];
  flowchartType?: 'feature-overview' | 'user-flow' | 'data-flow' | 'component-hierarchy' | 'page-structure';
  language?: 'en' | 'th';
  includeComponents?: boolean;
  includeDataModels?: boolean;
  includePages?: boolean;
}

interface FlowchartResponse {
  success: boolean;
  data?: FlowchartOutput;
  mermaidCode?: string;
  error?: string;
  rawResponse?: string;
}

// ===========================================
// Helper: Clean and Fix Mermaid Code
// ===========================================

function cleanMermaidCode(code: string): string {
  let cleaned = code;
  
  // 1. Fix escaped newlines
  cleaned = cleaned.replace(/\\n/g, '\n');
  
  // 2. Remove markdown code blocks
  cleaned = cleaned.replace(/```mermaid\s*/gi, '');
  cleaned = cleaned.replace(/```\s*/g, '');
  
  // 3. Ensure flowchart TD is at the start
  if (!cleaned.trim().startsWith('flowchart')) {
    const flowchartMatch = cleaned.match(/flowchart\s+(TD|LR|TB|BT|RL)/i);
    if (flowchartMatch) {
      cleaned = cleaned.substring(cleaned.indexOf(flowchartMatch[0]));
    }
  }
  
  // 4. Fix reserved keyword issues - "end" and "start" are reserved!
  // Replace :::end with :::endNode
  cleaned = cleaned.replace(/:::end\b/g, ':::endNode');
  // Replace :::start with :::startNode
  cleaned = cleaned.replace(/:::start\b/g, ':::startNode');
  // Replace classDef end with classDef endNode
  cleaned = cleaned.replace(/classDef\s+end\s+/g, 'classDef endNode ');
  // Replace classDef start with classDef startNode
  cleaned = cleaned.replace(/classDef\s+start\s+/g, 'classDef startNode ');
  // Fix node IDs that are just "End" or "Start" (case-insensitive boundary)
  cleaned = cleaned.replace(/\bEnd\[/gi, 'EndNode[');
  cleaned = cleaned.replace(/\bEnd\(/gi, 'EndNode(');
  cleaned = cleaned.replace(/\bStart\[/gi, 'StartNode[');
  cleaned = cleaned.replace(/\bStart\(/gi, 'StartNode(');
  // Fix edge references
  cleaned = cleaned.replace(/--> End\b/gi, '--> EndNode');
  cleaned = cleaned.replace(/--> Start\b/gi, '--> StartNode');
  cleaned = cleaned.replace(/\bEnd -->/gi, 'EndNode -->');
  cleaned = cleaned.replace(/\bStart -->/gi, 'StartNode -->');
  
  // 5. Fix Thai text - wrap unquoted Thai labels in quotes
  // Match patterns like A[Thai text] or A([Thai text])
  cleaned = cleaned.replace(
    /(\w+)\[([^\]"]*[ก-๙][^\]"]*)\]/g,
    (match, id, label) => `${id}["${label}"]`
  );
  
  // Fix stadium shapes with Thai text
  cleaned = cleaned.replace(
    /(\w+)\(\[([^\]"]*[ก-๙][^\]"]*)\]\)/g,
    (match, id, label) => `${id}(["${label}"])`
  );
  
  // Fix subgraph with Thai text
  cleaned = cleaned.replace(
    /subgraph\s+(\w+)\s*\[([^\]"]*[ก-๙][^\]"]*)\]/g,
    (match, id, label) => `subgraph ${id}["${label}"]`
  );
  
  // 6. Fix labels with spaces that aren't quoted
  // Pattern: ID[Label With Spaces] -> ID["Label With Spaces"]
  cleaned = cleaned.replace(
    /(\s+)(\w+)\[([^\]"]+\s+[^\]"]+)\]/g,
    (match, space, id, label) => `${space}${id}["${label}"]`
  );
  
  // 7. Fix route-style labels like [/login] 
  cleaned = cleaned.replace(
    /\[\/([^\]]+)\]/g,
    '["/$1"]'
  );
  
  // 8. Fix double quotes inside labels (replace with single quotes)
  const lines = cleaned.split('\n');
  const fixedLines = lines.map(line => {
    // Skip classDef and style lines
    if (line.trim().startsWith('classDef') || 
        line.trim().startsWith('style') ||
        line.trim().startsWith('%%')) {
      return line;
    }
    
    // Fix nested quotes in labels
    return line.replace(/\["([^"]*)"([^"]*)"([^"]*)"\]/g, '["$1\'$2\'$3"]');
  });
  cleaned = fixedLines.join('\n');
  
  // 9. Ensure proper line endings
  cleaned = cleaned.replace(/\r\n/g, '\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // 10. Ensure classDef for startNode and endNode exist
  if (!cleaned.includes('classDef startNode') && cleaned.includes(':::startNode')) {
    cleaned += '\n    classDef startNode fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff';
  }
  if (!cleaned.includes('classDef endNode') && cleaned.includes(':::endNode')) {
    cleaned += '\n    classDef endNode fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff';
  }
  
  return cleaned.trim();
}

// ===========================================
// Generate Simple Fallback Flowchart
// ===========================================

function generateFallbackFlowchart(websiteType: string, features: string[]): string {
  const featureNodes = features.slice(0, 8).map((f, i) => {
    const [category, key] = f.split(':');
    const safeId = key ? key.replace(/[^a-zA-Z0-9]/g, '') : `Feature${i}`;
    const label = key ? key.replace(/([A-Z])/g, ' $1').trim() : `Feature ${i + 1}`;
    const style = category === 'core' ? 'required' : 'recommended';
    return { id: safeId, label, style };
  });

  let mermaidCode = `flowchart TD
    StartNode(["Start"]):::startNode
`;

  // Add feature nodes
  featureNodes.forEach(node => {
    mermaidCode += `    ${node.id}["${node.label}"]:::${node.style}\n`;
  });

  mermaidCode += `    EndNode(["End"]):::endNode\n\n`;

  // Add edges
  mermaidCode += `    StartNode --> ${featureNodes[0]?.id || 'EndNode'}\n`;
  
  for (let i = 0; i < featureNodes.length - 1; i++) {
    mermaidCode += `    ${featureNodes[i].id} --> ${featureNodes[i + 1].id}\n`;
  }
  
  if (featureNodes.length > 0) {
    mermaidCode += `    ${featureNodes[featureNodes.length - 1].id} --> EndNode\n`;
  }

  // Add styles
  mermaidCode += `
    classDef required fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    classDef recommended fill:#3b82f6,stroke:#2563eb,stroke-width:1px,color:#fff
    classDef startNode fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef endNode fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
`;

  return mermaidCode;
}

// ===========================================
// POST Handler
// ===========================================

export async function POST(request: NextRequest) {
  try {
    const body: FlowchartRequest = await request.json();
    
    // Validate required fields
    if (!body.websiteType) {
      return NextResponse.json<FlowchartResponse>(
        { success: false, error: 'Website type is required' },
        { status: 400 }
      );
    }

    if (!body.selectedFeatures || body.selectedFeatures.length === 0) {
      return NextResponse.json<FlowchartResponse>(
        { success: false, error: 'At least one feature must be selected' },
        { status: 400 }
      );
    }

    // Build prompt options
    const promptOptions: BuildFlowchartPromptOptions = {
      websiteType: body.websiteType,
      selectedFeatures: body.selectedFeatures,
      flowchartType: body.flowchartType || 'feature-overview',
      language: body.language || 'th',
      includeComponents: body.includeComponents ?? false, // Simplified
      includeDataModels: body.includeDataModels ?? false, // Simplified
      includePages: body.includePages ?? false, // Simplified
      maxDepth: 2, // Keep it simple
    };

    // Build the prompt
    const prompt = buildFlowchartPrompt(promptOptions);

    // Generate with Gemini
    let rawResponse: string;
    try {
      rawResponse = await generateWithGemini(prompt);
    } catch (genError) {
      console.error('Gemini generation error:', genError);
      // Return fallback flowchart
      const fallbackCode = generateFallbackFlowchart(body.websiteType, body.selectedFeatures);
      return NextResponse.json<FlowchartResponse>({
        success: true,
        mermaidCode: fallbackCode,
        error: 'Used fallback flowchart due to AI error',
      });
    }

    // Try to parse JSON response
    try {
      const jsonStr = extractJSON(rawResponse);
      const flowchartData: FlowchartOutput = JSON.parse(jsonStr);

      // Validate and clean mermaidCode
      if (!flowchartData.mermaidCode) {
        throw new Error('No mermaidCode in response');
      }

      // Clean up the Mermaid code
      let mermaidCode = cleanMermaidCode(flowchartData.mermaidCode);
      
      // Apply additional sanitization
      mermaidCode = sanitizeMermaidCode(mermaidCode);

      flowchartData.mermaidCode = mermaidCode;

      return NextResponse.json<FlowchartResponse>({
        success: true,
        data: flowchartData,
        mermaidCode: mermaidCode,
      });
    } catch (parseError) {
      console.error('Error parsing flowchart response:', parseError);
      
      // Try to extract mermaid code directly from raw response
      let extractedCode = '';
      
      // Try markdown code block
      const mermaidMatch = rawResponse.match(/```mermaid\s*([\s\S]*?)\s*```/);
      if (mermaidMatch) {
        extractedCode = mermaidMatch[1].trim();
      }
      
      // Try finding flowchart directly
      if (!extractedCode) {
        const flowchartMatch = rawResponse.match(/flowchart\s+(TD|LR|TB|BT|RL)[\s\S]*?(?=```|$)/i);
        if (flowchartMatch) {
          extractedCode = flowchartMatch[0].trim();
        }
      }

      if (extractedCode) {
        // Clean the extracted code
        const cleanedCode = cleanMermaidCode(extractedCode);
        const sanitizedCode = sanitizeMermaidCode(cleanedCode);
        
        return NextResponse.json<FlowchartResponse>({
          success: true,
          mermaidCode: sanitizedCode,
        });
      }

      // Last resort: generate fallback
      const fallbackCode = generateFallbackFlowchart(body.websiteType, body.selectedFeatures);
      return NextResponse.json<FlowchartResponse>({
        success: true,
        mermaidCode: fallbackCode,
        error: 'Used fallback flowchart - original AI response could not be parsed',
      });
    }
  } catch (error) {
    console.error('Error generating flowchart:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json<FlowchartResponse>(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
