import { ProjectDetails, GeneratedPlan } from '@/types';
import { WEBSITE_TYPES, FEATURES, TARGET_AUDIENCES, TIMELINE_OPTIONS, formatBudget } from '@/data/constants';

export function buildPrompt(details: ProjectDetails): string {
  const websiteType = WEBSITE_TYPES.find(t => t.id === details.websiteType);
  const selectedFeatureNames = details.selectedFeatures
    .map(id => FEATURES.find(f => f.id === id))
    .filter(Boolean)
    .map(f => details.outputLanguage === 'th' ? f!.nameTh : f!.name);
  const targetAudience = TARGET_AUDIENCES.find(t => t.id === details.targetAudience);
  const timeline = TIMELINE_OPTIONS.find(t => t.id === details.timeline);
  const budgetStr = `${formatBudget(details.budgetRange[0], details.outputLanguage)} - ${formatBudget(details.budgetRange[1], details.outputLanguage)}`;

  const lang = details.outputLanguage === 'th' ? 'Thai' : 'English';
  const websiteTypeName = details.outputLanguage === 'th' ? websiteType?.nameTh : websiteType?.name;
  const targetAudienceName = details.outputLanguage === 'th' ? targetAudience?.nameTh : targetAudience?.name;
  const timelineName = details.outputLanguage === 'th' ? timeline?.nameTh : timeline?.name;

  return `You are an expert software project planner and business analyst. Generate a comprehensive project discovery and planning document.

PROJECT DETAILS:
- Project Name: ${details.projectName || 'Unnamed Project'}
- Website Type: ${websiteTypeName || 'Not specified'}
- Selected Features: ${selectedFeatureNames.join(', ') || 'None'}
- Target Audience: ${targetAudienceName || 'Not specified'}
- Budget Range: ${budgetStr}
- Timeline: ${timelineName || 'Not specified'}
- Additional Requirements: ${details.additionalInfo || 'None'}

IMPORTANT: Generate ALL content in ${lang} language.

Generate a JSON response with the following structure. Be detailed and specific to the project type and features selected:

{
  "requirements": {
    "business": {
      "title": "Business Requirements",
      "items": ["List 5-7 specific business requirements based on the project type and features"]
    },
    "functional": {
      "title": "Functional Requirements",
      "items": ["List 8-12 specific functional requirements for each selected feature"]
    },
    "nonFunctional": {
      "title": "Non-Functional Requirements",
      "items": ["List 5-7 non-functional requirements (performance, security, scalability, etc.)"]
    }
  },
  "personas": [
    {
      "name": "Thai/English name appropriate for persona",
      "role": "Primary user role",
      "age": "Age range",
      "occupation": "Job title",
      "goals": ["3-4 specific goals"],
      "painPoints": ["3-4 pain points this product solves"],
      "techSavviness": "Low/Medium/High",
      "avatar": "emoji representing persona (e.g. 👨‍💼, 👩‍💻, 🧑‍🎨)",
      "isPrimary": true
    },
    {
      "name": "Secondary persona name",
      "role": "Secondary user role",
      "age": "Age range",
      "occupation": "Job title",
      "goals": ["2-3 goals"],
      "painPoints": ["2-3 pain points"],
      "techSavviness": "Low/Medium/High",
      "avatar": "emoji",
      "isPrimary": false
    }
  ],
  "competitorAnalysis": {
    "competitors": [
      {
        "name": "Competitor 1",
        "description": "Brief description",
        "strengths": ["2-3 strengths"],
        "weaknesses": ["2-3 weaknesses"],
        "url": "example.com"
      },
      {
        "name": "Competitor 2",
        "description": "Brief description",
        "strengths": ["2-3 strengths"],
        "weaknesses": ["2-3 weaknesses"]
      },
      {
        "name": "Competitor 3",
        "description": "Brief description",
        "strengths": ["2-3 strengths"],
        "weaknesses": ["2-3 weaknesses"]
      }
    ],
    "swot": {
      "strengths": ["4-5 project strengths"],
      "weaknesses": ["3-4 potential weaknesses"],
      "opportunities": ["3-4 market opportunities"],
      "threats": ["3-4 potential threats"]
    }
  },
  "scope": {
    "mustHave": {
      "title": "Must Have (Critical)",
      "items": ["List 5-8 critical features that must be included in MVP"]
    },
    "shouldHave": {
      "title": "Should Have (Important)",
      "items": ["List 4-6 important features for Phase 2"]
    },
    "couldHave": {
      "title": "Could Have (Nice to Have)",
      "items": ["List 3-5 nice-to-have features"]
    },
    "wontHave": {
      "title": "Won't Have (Out of Scope)",
      "items": ["List 3-4 features explicitly out of scope"]
    }
  },
  "timeline": {
    "phases": [
      {
        "name": "Phase 1: Planning & Design",
        "duration": "X weeks",
        "tasks": ["List 4-5 tasks"],
        "deliverables": ["List 2-3 deliverables"]
      },
      {
        "name": "Phase 2: Development",
        "duration": "X weeks",
        "tasks": ["List 5-7 tasks"],
        "deliverables": ["List 3-4 deliverables"]
      },
      {
        "name": "Phase 3: Testing & QA",
        "duration": "X weeks",
        "tasks": ["List 3-4 tasks"],
        "deliverables": ["List 2-3 deliverables"]
      },
      {
        "name": "Phase 4: Launch & Deployment",
        "duration": "X weeks",
        "tasks": ["List 3-4 tasks"],
        "deliverables": ["List 2-3 deliverables"]
      }
    ],
    "totalDuration": "Total project duration in weeks/months"
  },
  "budget": {
    "items": [
      {
        "category": "Design & UX",
        "description": "UI/UX design, wireframes, prototypes",
        "estimatedCost": "XXX,XXX THB",
        "percentage": 15
      },
      {
        "category": "Frontend Development",
        "description": "User interface development",
        "estimatedCost": "XXX,XXX THB",
        "percentage": 25
      },
      {
        "category": "Backend Development",
        "description": "Server-side logic, API, database",
        "estimatedCost": "XXX,XXX THB",
        "percentage": 30
      },
      {
        "category": "Testing & QA",
        "description": "Quality assurance and testing",
        "estimatedCost": "XXX,XXX THB",
        "percentage": 10
      },
      {
        "category": "Infrastructure",
        "description": "Hosting, domain, SSL, etc.",
        "estimatedCost": "XXX,XXX THB",
        "percentage": 10
      },
      {
        "category": "Contingency",
        "description": "Buffer for unexpected costs",
        "estimatedCost": "XXX,XXX THB",
        "percentage": 10
      }
    ],
    "totalEstimate": "Total estimate within budget range",
    "currency": "THB",
    "notes": ["2-3 important budget notes or assumptions"]
  },
  "risks": {
    "risks": [
      {
        "id": "risk-1",
        "name": "Risk Name",
        "description": "Detailed description",
        "probability": "low|medium|high",
        "impact": "low|medium|high",
        "mitigation": "How to mitigate this risk",
        "category": "Technical/Business/Resource/External"
      }
    ],
    "overallRiskLevel": "low|medium|high",
    "recommendations": ["3-4 risk management recommendations"]
  }
}

Ensure the budget breakdown adds up to approximately 100% and stays within the provided budget range.
Make the timeline realistic based on the features selected and the timeline constraint.
Generate 5-7 risks covering technical, business, resource, and external categories.

RESPOND WITH ONLY THE JSON OBJECT, no additional text or markdown code blocks.`;
}

export function parseGeneratedPlan(json: string, details: ProjectDetails): GeneratedPlan {
  const parsed = JSON.parse(json);
  
  return {
    id: `plan-${Date.now()}`,
    projectName: details.projectName || 'Unnamed Project',
    generatedAt: new Date().toISOString(),
    inputData: details,
    requirements: parsed.requirements,
    personas: parsed.personas,
    competitorAnalysis: parsed.competitorAnalysis,
    scope: parsed.scope,
    timeline: parsed.timeline,
    budget: parsed.budget,
    risks: parsed.risks,
  };
}

