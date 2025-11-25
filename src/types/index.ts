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

// System Architecture Types
export interface ArchitectureLayer {
  name: string;
  description: string;
  technologies: string[];
}

export interface ArchitectureDiagram {
  description: string;
  layers: ArchitectureLayer[];
}

export interface ArchitectureOverview {
  title: string;
  description: string;
  architectureType: string;
  architecturePattern: string;
  deploymentModel: string;
  cloudProvider?: string;
  diagram: ArchitectureDiagram;
  keyDecisions: string[];
}

export interface FrontendComponent {
  name: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  dependencies: string[];
}

export interface BackendService {
  name: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  dependencies: string[];
}

export interface ExternalService {
  name: string;
  purpose: string;
  provider: string;
  integrationMethod: string;
}

export interface Database {
  name: string;
  type: string;
  technology: string;
  purpose: string;
}

export interface ComponentsSection {
  title: string;
  frontendComponents: FrontendComponent[];
  backendServices: BackendService[];
  externalServices: ExternalService[];
  databases: Database[];
}

export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  authentication: string;
  requestBody?: string;
  responseFormat?: string;
}

export interface APIModule {
  module: string;
  baseUrl: string;
  endpoints: APIEndpoint[];
}

export interface ErrorCode {
  code: string;
  meaning: string;
}

export interface ErrorHandling {
  format: string;
  commonCodes: ErrorCode[];
}

export interface RateLimiting {
  enabled: boolean;
  limits: string;
}

export interface APIDesign {
  title: string;
  apiStyle: string;
  apiVersioning: string;
  authenticationMethod: string;
  endpoints: APIModule[];
  errorHandling: ErrorHandling;
  rateLimiting: RateLimiting;
}

export interface Attribute {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface Relationship {
  relatedEntity: string;
  type: string;
  description: string;
}

export interface Entity {
  name: string;
  description: string;
  attributes: Attribute[];
  relationships: Relationship[];
  indexes: string[];
}

export interface CacheStrategy {
  description: string;
  cachedData: string[];
  invalidationStrategy: string;
}

export interface DataModel {
  title: string;
  description: string;
  entities: Entity[];
  dataFlowDescription: string;
  cacheStrategy: CacheStrategy;
}

export interface FlowStep {
  step: number;
  actor: string;
  action: string;
  system: string;
  description: string;
}

export interface KeyFlow {
  name: string;
  description: string;
  actors: string[];
  steps: FlowStep[];
  alternativeFlows: string[];
  businessRules: string[];
}

export interface KeyFlows {
  title: string;
  flows: KeyFlow[];
}

export interface AuthenticationConfig {
  method: string;
  implementation: string;
  tokenManagement: string;
  sessionManagement: string;
}

export interface Role {
  name: string;
  description: string;
  permissions: string[];
}

export interface AuthorizationConfig {
  model: string;
  roles: Role[];
  implementation: string;
}

export interface DataProtection {
  encryptionAtRest: string;
  encryptionInTransit: string;
  sensitiveDataHandling: string;
  dataRetention: string;
}

export interface SecurityMeasure {
  category: string;
  implementation: string;
  tools: string[];
}

export interface Compliance {
  standards: string[];
  requirements: string[];
}

export interface SecurityMonitoring {
  logging: string;
  alerting: string;
  auditTrail: string;
}

export interface SecurityArchitecture {
  title: string;
  overview: string;
  authentication: AuthenticationConfig;
  authorization: AuthorizationConfig;
  dataProtection: DataProtection;
  securityMeasures: SecurityMeasure[];
  compliance: Compliance;
  monitoring: SecurityMonitoring;
}

export interface SystemArchitecture {
  overview: ArchitectureOverview;
  components: ComponentsSection;
  apiDesign: APIDesign;
  dataModel: DataModel;
  keyFlows: KeyFlows;
  security: SecurityArchitecture;
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
  systemArchitecture: SystemArchitecture;
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

