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

  return `You are an expert software project planner, business analyst, and solution architect. Generate a comprehensive project discovery and planning document.

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
  "systemArchitecture": {
    "overview": {
      "title": "Architecture Overview",
      "description": "High-level description of the system architecture approach",
      "architectureType": "Monolithic/Microservices/Serverless/Hybrid",
      "architecturePattern": "MVC/Clean Architecture/Hexagonal/Event-Driven/etc.",
      "deploymentModel": "Cloud/On-Premise/Hybrid",
      "cloudProvider": "AWS/GCP/Azure/Vercel/etc. (if applicable)",
      "diagram": {
        "description": "Text description of the high-level architecture diagram",
        "layers": [
          {
            "name": "Presentation Layer",
            "description": "User interface and client applications",
            "technologies": ["Next.js", "React", "Tailwind CSS"]
          },
          {
            "name": "Application Layer",
            "description": "Business logic and API services",
            "technologies": ["Node.js", "Express/NestJS"]
          },
          {
            "name": "Data Layer",
            "description": "Data storage and persistence",
            "technologies": ["PostgreSQL", "Redis", "S3"]
          },
          {
            "name": "Infrastructure Layer",
            "description": "Cloud services and deployment",
            "technologies": ["Docker", "Kubernetes", "CI/CD"]
          }
        ]
      },
      "keyDecisions": ["List 3-5 key architectural decisions and rationale"]
    },
    "components": {
      "title": "Logical View & Components",
      "frontendComponents": [
        {
          "name": "Component Name",
          "description": "What this component does",
          "responsibilities": ["Responsibility 1", "Responsibility 2"],
          "technologies": ["React", "etc."],
          "dependencies": ["Other components it depends on"]
        }
      ],
      "backendServices": [
        {
          "name": "Service Name",
          "description": "What this service does",
          "responsibilities": ["Responsibility 1", "Responsibility 2"],
          "technologies": ["Node.js", "etc."],
          "dependencies": ["Database", "External APIs"]
        }
      ],
      "externalServices": [
        {
          "name": "External Service Name",
          "purpose": "What it's used for",
          "provider": "Provider name",
          "integrationMethod": "REST API/SDK/Webhook"
        }
      ],
      "databases": [
        {
          "name": "Database Name",
          "type": "Relational/NoSQL/Cache/Search",
          "technology": "PostgreSQL/MongoDB/Redis/Elasticsearch",
          "purpose": "What data it stores"
        }
      ]
    },
    "apiDesign": {
      "title": "API Design & Communication Contracts",
      "apiStyle": "REST/GraphQL/gRPC/WebSocket",
      "apiVersioning": "URL versioning/Header versioning",
      "authenticationMethod": "JWT/OAuth2/API Key/Session",
      "endpoints": [
        {
          "module": "Module Name (e.g., Authentication, Users, Products)",
          "baseUrl": "/api/v1/module",
          "endpoints": [
            {
              "method": "GET/POST/PUT/DELETE",
              "path": "/endpoint-path",
              "description": "What this endpoint does",
              "authentication": "Required/Optional/None",
              "requestBody": "Brief description of request payload (if any)",
              "responseFormat": "Brief description of response format"
            }
          ]
        }
      ],
      "errorHandling": {
        "format": "Standard error response format description",
        "commonCodes": [
          {
            "code": "400",
            "meaning": "Bad Request - Invalid input"
          },
          {
            "code": "401",
            "meaning": "Unauthorized - Authentication required"
          },
          {
            "code": "403",
            "meaning": "Forbidden - Insufficient permissions"
          },
          {
            "code": "404",
            "meaning": "Not Found - Resource doesn't exist"
          },
          {
            "code": "500",
            "meaning": "Internal Server Error"
          }
        ]
      },
      "rateLimiting": {
        "enabled": true,
        "limits": "Description of rate limiting rules"
      }
    },
    "dataModel": {
      "title": "Data Model & Schema Overview",
      "description": "Overview of the data modeling approach",
      "entities": [
        {
          "name": "Entity Name",
          "description": "What this entity represents",
          "attributes": [
            {
              "name": "attribute_name",
              "type": "string/number/boolean/date/relation",
              "required": true,
              "description": "What this attribute stores"
            }
          ],
          "relationships": [
            {
              "relatedEntity": "Related Entity Name",
              "type": "one-to-one/one-to-many/many-to-many",
              "description": "Description of the relationship"
            }
          ],
          "indexes": ["List of indexed fields for performance"]
        }
      ],
      "dataFlowDescription": "Description of how data flows through the system",
      "cacheStrategy": {
        "description": "Caching approach description",
        "cachedData": ["Types of data that will be cached"],
        "invalidationStrategy": "How cache invalidation is handled"
      }
    },
    "keyFlows": {
      "title": "Key Flows & Sequences",
      "flows": [
        {
          "name": "Flow Name (e.g., User Registration, Order Checkout)",
          "description": "What this flow accomplishes",
          "actors": ["User", "System", "External Service"],
          "steps": [
            {
              "step": 1,
              "actor": "Who performs this step",
              "action": "What action is taken",
              "system": "Which system/component handles it",
              "description": "Detailed description of what happens"
            }
          ],
          "alternativeFlows": ["Description of alternative paths or error cases"],
          "businessRules": ["Business rules that apply to this flow"]
        }
      ]
    },
    "security": {
      "title": "Security Architecture",
      "overview": "Overall security approach and principles",
      "authentication": {
        "method": "JWT/OAuth2/Session/etc.",
        "implementation": "Description of how authentication is implemented",
        "tokenManagement": "How tokens are issued, refreshed, and revoked",
        "sessionManagement": "Session handling approach"
      },
      "authorization": {
        "model": "RBAC/ABAC/ACL",
        "roles": [
          {
            "name": "Role Name",
            "description": "What this role can do",
            "permissions": ["List of permissions"]
          }
        ],
        "implementation": "How authorization is enforced"
      },
      "dataProtection": {
        "encryptionAtRest": "How data is encrypted in storage",
        "encryptionInTransit": "How data is protected during transmission",
        "sensitiveDataHandling": "How PII and sensitive data is handled",
        "dataRetention": "Data retention and deletion policies"
      },
      "securityMeasures": [
        {
          "category": "Input Validation/XSS Prevention/CSRF Protection/SQL Injection/etc.",
          "implementation": "How this is implemented",
          "tools": ["Libraries or tools used"]
        }
      ],
      "compliance": {
        "standards": ["PDPA", "GDPR", "PCI-DSS", "etc. - as applicable"],
        "requirements": ["Specific compliance requirements to address"]
      },
      "monitoring": {
        "logging": "What is logged and how",
        "alerting": "Security alerting approach",
        "auditTrail": "Audit trail implementation"
      }
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

SYSTEM ARCHITECTURE GENERATION GUIDELINES:
1. Choose appropriate architecture type based on project complexity and budget
2. For simple projects (budget < 200,000): Recommend Monolithic with Next.js full-stack
3. For medium projects: Consider modular monolith or simple microservices
4. For complex projects (budget > 500,000): Recommend microservices if appropriate
5. Always include security best practices appropriate for the project type
6. Generate 3-5 main entities for the data model based on selected features
7. Create 2-4 key flows that represent the most important user journeys
8. Design API endpoints that cover all selected features
9. Include appropriate security measures based on the target audience (especially for B2B/Government)

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
    systemArchitecture: parsed.systemArchitecture,
    timeline: parsed.timeline,
    budget: parsed.budget,
    risks: parsed.risks,
  };
}