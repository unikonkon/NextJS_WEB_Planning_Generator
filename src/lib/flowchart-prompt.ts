// ===========================================
// Flowchart Prompt Builder
// ===========================================

import {
  type WebsiteType,
  type Priority,
  type Complexity,
  type FeatureDetail,
  websiteFeatures
} from '@/app/flowchart/WebsiteType';

// ===========================================
// Types
// ===========================================

export interface FlowchartNode {
  id: string;
  label: string;
  type: 'start' | 'end' | 'process' | 'decision' | 'subprocess' | 'database' | 'component';
  style?: string;
}

export interface FlowchartEdge {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dotted' | 'thick';
}

export interface FlowchartOutput {
  title: string;
  description: string;
  mermaidCode: string;
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  metadata: {
    websiteType: WebsiteType;
    featureCategory: 'core' | 'advanced' | 'all';
    priorityFilter?: Priority;
    complexityFilter?: Complexity;
    totalNodes: number;
    totalEdges: number;
  };
}

export interface BuildFlowchartPromptOptions {
  websiteType: WebsiteType;
  selectedFeatures: string[]; // Array of "category:featureKey" strings
  flowchartType?: 'feature-overview' | 'user-flow' | 'data-flow' | 'component-hierarchy' | 'page-structure';
  language?: 'en' | 'th';
  includeComponents?: boolean;
  includeDataModels?: boolean;
  includePages?: boolean;
  maxDepth?: number;
}

// ===========================================
// Helper Functions
// ===========================================

function getSelectedFeaturesData(
  websiteType: WebsiteType,
  selectedFeatures: string[]
): { core: Record<string, FeatureDetail>; advanced: Record<string, FeatureDetail> } {
  const features = websiteFeatures[websiteType];
  const result: { core: Record<string, FeatureDetail>; advanced: Record<string, FeatureDetail> } = {
    core: {},
    advanced: {}
  };

  selectedFeatures.forEach((key) => {
    const [category, featureKey] = key.split(':');
    if (category === 'core' && (features.core as Record<string, FeatureDetail>)[featureKey]) {
      result.core[featureKey] = (features.core as Record<string, FeatureDetail>)[featureKey];
    } else if (category === 'advanced' && (features.advanced as Record<string, FeatureDetail>)[featureKey]) {
      result.advanced[featureKey] = (features.advanced as Record<string, FeatureDetail>)[featureKey];
    }
  });

  return result;
}

function formatFeaturesForPrompt(features: Record<string, FeatureDetail>): string {
  return Object.entries(features)
    .map(([key, feature]) => {
      // Create a safe node ID from feature key (camelCase, no special chars)
      const safeId = key.replace(/[^a-zA-Z0-9]/g, '');
      
      let text = `
### ${feature.name} (ID: ${safeId})
- Description: ${feature.description}
- Priority: ${feature.priority}
- Complexity: ${feature.complexity}
- Components: ${feature.components.slice(0, 5).join(', ')}${feature.components.length > 5 ? '...' : ''}`;
      
      if (feature.dataModels && feature.dataModels.length > 0) {
        text += `\n- Data Models: ${feature.dataModels.length} models`;
      }
      if (feature.pages && feature.pages.length > 0) {
        text += `\n- Pages: ${feature.pages.length} pages`;
      }
      if (feature.integrations && feature.integrations.length > 0) {
        text += `\n- Integrations: ${feature.integrations.slice(0, 3).join(', ')}${feature.integrations.length > 3 ? '...' : ''}`;
      }
      
      return text;
    })
    .join('\n');
}

// ===========================================
// Mermaid Code Sanitizer (for post-processing)
// ===========================================

export function sanitizeMermaidCode(code: string): string {
  let sanitized = code;
  
  // Fix escaped newlines
  sanitized = sanitized.replace(/\\n/g, '\n');
  
  // Remove markdown code blocks
  sanitized = sanitized.replace(/```mermaid\n?/g, '');
  sanitized = sanitized.replace(/```\n?/g, '');
  
  // CRITICAL: Fix reserved keyword issues - "end" and "start" are reserved!
  // Replace :::end with :::endNode
  sanitized = sanitized.replace(/:::end\b/g, ':::endNode');
  // Replace :::start with :::startNode  
  sanitized = sanitized.replace(/:::start\b/g, ':::startNode');
  // Replace classDef end with classDef endNode
  sanitized = sanitized.replace(/classDef\s+end\s+/g, 'classDef endNode ');
  // Replace classDef start with classDef startNode
  sanitized = sanitized.replace(/classDef\s+start\s+/g, 'classDef startNode ');
  // Fix node IDs that are just "End" or "Start"
  sanitized = sanitized.replace(/\bEnd\[/gi, 'EndNode[');
  sanitized = sanitized.replace(/\bEnd\(/gi, 'EndNode(');
  sanitized = sanitized.replace(/\bStart\[/gi, 'StartNode[');
  sanitized = sanitized.replace(/\bStart\(/gi, 'StartNode(');
  // Fix edge references
  sanitized = sanitized.replace(/--> End\b/gi, '--> EndNode');
  sanitized = sanitized.replace(/--> Start\b/gi, '--> StartNode');
  sanitized = sanitized.replace(/\bEnd -->/gi, 'EndNode -->');
  sanitized = sanitized.replace(/\bStart -->/gi, 'StartNode -->');
  
  // Fix common Thai text issues - wrap in quotes if not already
  // Match node definitions like A[Thai Text] and ensure they use quotes
  sanitized = sanitized.replace(
    /(\w+)\[([^\]"]+[ก-๙][^\]"]*)\]/g, 
    '$1["$2"]'
  );
  
  // Fix stadium shapes with Thai text
  sanitized = sanitized.replace(
    /(\w+)\(\[([^\]"]+[ก-๙][^\]"]*)\]\)/g,
    '$1(["$2"])'
  );
  
  // Fix subgraph labels with Thai text
  sanitized = sanitized.replace(
    /subgraph\s+(\w+)\s*\[([^\]"]+[ก-๙][^\]"]*)\]/g,
    'subgraph $1["$2"]'
  );
  
  // Remove problematic page route syntax like [/login]
  sanitized = sanitized.replace(
    /\[\/([^\]]+)\]/g,
    '["/$1"]'
  );
  
  // Fix node IDs that might have special characters
  const lines = sanitized.split('\n');
  const fixedLines = lines.map(line => {
    // Skip comments, subgraph declarations, classDef, and style lines
    if (line.trim().startsWith('%%') || 
        line.trim().startsWith('subgraph') ||
        line.trim() === 'end' ||
        line.trim().startsWith('classDef') ||
        line.trim().startsWith('style') ||
        line.trim().startsWith('direction')) {
      return line;
    }
    
    // Fix node definitions with spaces in IDs
    // Pattern: NodeWithSpace[Label] -> NodeWithSpace["Label"]
    return line.replace(
      /(\s+)([A-Za-z_][A-Za-z0-9_]*)\[([^\]]+)\]/g,
      (match, space, id, label) => {
        // If label already has quotes, keep it
        if (label.startsWith('"') && label.endsWith('"')) {
          return match;
        }
        // Wrap label in quotes
        return `${space}${id}["${label}"]`;
      }
    );
  });
  
  sanitized = fixedLines.join('\n');
  
  // Ensure classDef for startNode and endNode exist
  if (!sanitized.includes('classDef startNode') && sanitized.includes(':::startNode')) {
    sanitized += '\n    classDef startNode fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff';
  }
  if (!sanitized.includes('classDef endNode') && sanitized.includes(':::endNode')) {
    sanitized += '\n    classDef endNode fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff';
  }
  
  // Ensure there's proper spacing
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
  
  return sanitized.trim();
}

// ===========================================
// Main Build Prompt Function
// ===========================================

export function buildFlowchartPrompt(options: BuildFlowchartPromptOptions): string {
  const {
    websiteType,
    selectedFeatures,
    flowchartType = 'feature-overview',
    language = 'th',
    maxDepth = 2
  } = options;

  // Get selected features data
  const featuresData = getSelectedFeaturesData(websiteType, selectedFeatures);
  const coreFeatureText = formatFeaturesForPrompt(featuresData.core);
  const advancedFeatureText = formatFeaturesForPrompt(featuresData.advanced);

  const hasCore = Object.keys(featuresData.core).length > 0;
  const hasAdvanced = Object.keys(featuresData.advanced).length > 0;
  
  const coreCount = Object.keys(featuresData.core).length;
  const advancedCount = Object.keys(featuresData.advanced).length;

  // Flowchart type specific instructions
  const flowchartInstructions: Record<string, string> = {
    'feature-overview': `Create a SIMPLE flowchart showing the main features and their relationships.
- Show only the main ${coreCount + advancedCount} features as nodes
- Connect features that depend on each other
- Use Start and End nodes
- Keep it simple - maximum 15-20 nodes total`,

    'user-flow': `Create a user journey flowchart for the ${websiteType} website.
- Start with user entry
- Show main decision points
- Include key features as processes
- End with conversion/completion`,

    'data-flow': `Create a data flow diagram.
- Show main data entities as database nodes
- Connect with data operations
- Keep simple - focus on main flows`,

    'component-hierarchy': `Create a component hierarchy.
- Show main components grouped by feature
- Use subgraphs for grouping
- Keep depth to 2 levels`,

    'page-structure': `Create a page/route structure.
- Show main pages as nodes
- Connect with navigation flows
- Group by feature area`
  };

  // Build the prompt with STRICT Mermaid syntax rules
  const prompt = `You are a Mermaid diagram expert. Generate a SIMPLE, VALID Mermaid flowchart.

## CRITICAL MERMAID SYNTAX RULES (MUST FOLLOW):

1. **Node IDs**: Use ONLY alphanumeric characters and underscores. NO spaces, NO hyphens, NO special characters.
   - GOOD: Auth, UserDashboard, API_Integration
   - BAD: user-auth, API Integration, ระบบ

2. **Labels with spaces or special characters**: ALWAYS use double quotes.
   - GOOD: Auth["User Authentication"]
   - GOOD: Start(["เริ่มต้น"])
   - BAD: Auth[User Authentication]
   - BAD: Start([เริ่มต้น])

3. **Thai text**: ALWAYS wrap in double quotes.
   - GOOD: A["ระบบยืนยันตัว"]
   - BAD: A[ระบบยืนยันตัว]

4. **Subgraph labels**: Use quotes for labels.
   - GOOD: subgraph Core["Core Features"]
   - BAD: subgraph Core[Core Features]

5. **No nested quotes**: Don't use quotes inside quoted labels.

6. **classDef syntax**: Must be on separate lines at the end.

## Task
Generate a ${flowchartType} flowchart for a **${websiteType.toUpperCase()}** website.

${flowchartInstructions[flowchartType]}

## Selected Features
${hasCore ? `### Core Features (${coreCount})
${coreFeatureText}` : ''}

${hasAdvanced ? `### Advanced Features (${advancedCount})
${advancedFeatureText}` : ''}

## Output Requirements

Return ONLY valid JSON with this structure:
{
  "title": "Title in ${language === 'th' ? 'Thai' : 'English'}",
  "description": "Brief description",
  "mermaidCode": "VALID Mermaid code as a single string with \\n for newlines",
  "nodes": [{"id": "NodeId", "label": "Label", "type": "process"}],
  "edges": [{"from": "Node1", "to": "Node2"}],
  "metadata": {"websiteType": "${websiteType}", "featureCategory": "all", "totalNodes": 10, "totalEdges": 9}
}

## VALID Mermaid Example (FOLLOW THIS PATTERN):

flowchart TD
    StartNode(["Start"]):::startNode
    Auth["Authentication"]:::required
    Dashboard["Dashboard"]:::required
    Settings["Settings"]:::recommended
    EndNode(["End"]):::endNode

    StartNode --> Auth
    Auth --> Dashboard
    Dashboard --> Settings
    Settings --> EndNode

    classDef required fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    classDef recommended fill:#3b82f6,stroke:#2563eb,stroke-width:1px,color:#fff
    classDef startNode fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef endNode fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff

## CRITICAL:
- NEVER use "end" as a node ID or class name - it's a Mermaid reserved keyword!
- Use "EndNode" or "Finish" instead
- NEVER use "start" as ID - use "StartNode" or "Begin"

## Important:
- Keep the flowchart SIMPLE (max ${maxDepth} levels deep)
- Use ONLY the node IDs I provided (alphanumeric)
- ALWAYS quote labels that contain spaces or Thai characters
- Test your syntax mentally before outputting
- The mermaidCode MUST render without errors

Generate now:`;

  return prompt;
}

// ===========================================
// Specialized Prompt Builders
// ===========================================

export function buildFeatureOverviewPrompt(
  websiteType: WebsiteType,
  selectedFeatures: string[],
  options?: Partial<BuildFlowchartPromptOptions>
): string {
  return buildFlowchartPrompt({
    websiteType,
    selectedFeatures,
    flowchartType: 'feature-overview',
    ...options
  });
}

export function buildUserFlowPrompt(
  websiteType: WebsiteType,
  selectedFeatures: string[],
  options?: Partial<BuildFlowchartPromptOptions>
): string {
  return buildFlowchartPrompt({
    websiteType,
    selectedFeatures,
    flowchartType: 'user-flow',
    includeDataModels: false,
    ...options
  });
}

export function buildDataFlowPrompt(
  websiteType: WebsiteType,
  selectedFeatures: string[],
  options?: Partial<BuildFlowchartPromptOptions>
): string {
  return buildFlowchartPrompt({
    websiteType,
    selectedFeatures,
    flowchartType: 'data-flow',
    includeDataModels: true,
    includeComponents: false,
    ...options
  });
}

export function buildPageStructurePrompt(
  websiteType: WebsiteType,
  selectedFeatures: string[],
  options?: Partial<BuildFlowchartPromptOptions>
): string {
  return buildFlowchartPrompt({
    websiteType,
    selectedFeatures,
    flowchartType: 'page-structure',
    includePages: true,
    includeComponents: false,
    includeDataModels: false,
    ...options
  });
}
