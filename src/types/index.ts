// Website Types
export type WebsiteTypeId = 'ecommerce' | 'blog' | 'portfolio' | 'saas' | 'landing';

export interface WebsiteType {
  id: WebsiteTypeId;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  defaultFeatures: string[];
}

// Features
export interface Feature {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  category: FeatureCategory;
  defaultFor: WebsiteTypeId[];
}

export type FeatureCategory = 
  | 'authentication' 
  | 'payment' 
  | 'communication' 
  | 'admin' 
  | 'ux-ui'
  | 'content'
  | 'analytics';

// Project Details
export interface ProjectDetails {
  websiteType: WebsiteTypeId | null;
  selectedFeatures: string[];
  targetAudience: string;
  budgetRange: [number, number];
  timeline: string;
  additionalInfo: string;
  outputLanguage: 'en' | 'th';
  projectName: string;
}

// Generated Plan Types
export interface RequirementsDocument {
  business: {
    title: string;
    items: string[];
  };
  functional: {
    title: string;
    items: string[];
  };
  nonFunctional: {
    title: string;
    items: string[];
  };
}

export interface UserPersona {
  name: string;
  role: string;
  age: string;
  occupation: string;
  goals: string[];
  painPoints: string[];
  techSavviness: string;
  avatar: string;
  isPrimary: boolean;
}

export interface Competitor {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  url?: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  swot: SWOTAnalysis;
}

export interface DetailedScopeItem {
  feature: string;
  requirements?: string[];
  description?: string;
  notes?: string;
}

export type ScopeItem = string | DetailedScopeItem;

export interface ScopeSection {
  title: string;
  items: ScopeItem[];
}

export interface MoSCoWScope {
  mustHave: ScopeSection;
  shouldHave: ScopeSection;
  couldHave: ScopeSection;
  wontHave: ScopeSection;
}

export interface ProjectPhase {
  name: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
}

export interface TimelineMilestone {
  phases: ProjectPhase[];
  totalDuration: string;
}

export interface BudgetItem {
  category: string;
  description: string;
  estimatedCost: string;
  percentage: number;
}

export interface BudgetEstimation {
  items: BudgetItem[];
  totalEstimate: string;
  currency: string;
  notes: string[];
}

export interface Risk {
  id: string;
  name: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  category: string;
}

export interface RiskAssessment {
  risks: Risk[];
  overallRiskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface GeneratedPlan {
  id: string;
  projectName: string;
  generatedAt: string;
  inputData: ProjectDetails;
  requirements: RequirementsDocument;
  personas: UserPersona[];
  competitorAnalysis: CompetitorAnalysis;
  scope: MoSCoWScope;
  timeline: TimelineMilestone;
  budget: BudgetEstimation;
  risks: RiskAssessment;
}

// Saved Project
export interface SavedProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  inputData: ProjectDetails;
  generatedPlan?: GeneratedPlan;
}

// API Types
export interface GenerateRequest {
  projectDetails: ProjectDetails;
}

export interface GenerateResponse {
  success: boolean;
  plan?: GeneratedPlan;
  error?: string;
}

