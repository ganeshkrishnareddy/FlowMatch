export type DifficultyType = 'Beginner' | 'Intermediate' | 'Advanced';
export type SecurityStatusType = 'Passed' | 'Review Recommended' | 'Potential Risk';
export type WorkflowOriginType = 'third_party_import' | 'flowmatch_original';
export type ValidationStatusType = 'Valid' | 'Valid With Warnings' | 'Invalid';
export type DuplicateStatusType = 'exact_duplicate' | 'possible_duplicate' | 'unique';

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters?: Record<string, any>;
  credentials?: Record<string, any>;
}

export interface WorkflowConnection {
  main: Array<Array<{
    node: string;
    index: number;
  }>>;
}

export interface Workflow {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  originalWorkflowJson: Record<string, any>;
  normalizedWorkflowJson: Record<string, any>;
  nodeCount: number;
  integrationCount: number;
  difficulty: DifficultyType;
  estimatedSetupTime: string;
  category?: WorkflowCategory;
  categoryId?: string;
  integrations: string[]; // integration names/slugs
  securityStatus: SecurityStatusType;
  verified: boolean;
  featured: boolean;
  downloadCount: number;
  viewCount: number;
  workflowOrigin: WorkflowOriginType;
  instructionStatus: string; // 'auto_generated' | 'flowmatch_original'
  instructions?: WorkflowInstructions;
  qualityScore: number;
  validationStatus: ValidationStatusType;
  provenanceStatus: string; // 'source_repository_indexed' | 'flowmatch_original'
  importBatch?: string;
  sources?: WorkflowSource[];
  display_title?: string;
  display_description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface WorkflowIntegration {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  description?: string;
  workflowCount?: number;
}

export interface WorkflowFingerprint {
  id: string;
  workflowId: string;
  exactHash: string;
  structuralHash: string;
  nodeSignature?: string;
  connectionSignature?: string;
}

export interface WorkflowSource {
  id: string;
  workflowId: string;
  sourceName: string;
  sourceUrl?: string;
  sourceAuthor?: string;
  sourceLicense?: string;
  sourceRepository?: string;
  sourceFilePath?: string;
  discoveredAt: string;
}

export interface SecurityFinding {
  id: string;
  type: string; // 'secret' | 'execute_command' | 'code' | 'http_request' | 'domain' | 'community' | 'insecure_url'
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  nodeName: string;
  nodeType: string;
  message: string;
  recommendation: string;
}

export interface SecurityScan {
  id: string;
  workflowId: string;
  status: SecurityStatusType;
  findings: SecurityFinding[];
  scannedAt: string;
}

export interface WorkflowValidationReport {
  id: string;
  workflowId: string;
  status: ValidationStatusType;
  issues: string[]; // List of validation warning/error descriptions
  validatedAt: string;
}

export interface WorkflowQualityReport {
  id: string;
  workflowId: string;
  score: number;
  breakdown: {
    jsonValidity: number;      // Max 20
    connectionValidity: number; // Max 15
    clarity: number;            // Max 15
    instructionQuality: number; // Max 15
    securityScan: number;       // Max 10
    complexity: number;         // Max 10
    metadataCompleteness: number; // Max 10
    testingGuidance: number;    // Max 5
  };
  scoredAt: string;
}

export interface WorkflowInstructions {
  prerequisites: string[];
  setupInstructions: string[];
  requiredAccounts: string[];
  requiredCredentials: string[];
  configurationSteps: string[];
  testingSteps: string[];
  expectedResult: string;
  troubleshooting: string[];
  securityNotes: string[];
  customizationIdeas?: string[];
}

export interface WorkflowMatchScore {
  total: number;
  integrationScore: number;
  keywordScore: number;
  categoryScore: number;
  triggerScore: number;
  complexityScore: number;
}

export interface WorkflowMatch {
  workflow: Workflow;
  matchScore: WorkflowMatchScore;
  matchReason: string;
}

export interface ImportBatch {
  id: string;
  batchName: string;
  filesScanned: number;
  validWorkflows: number;
  invalidWorkflows: number;
  uniqueWorkflows: number;
  exactDuplicates: number;
  possibleDuplicates: number;
  importedAt: string;
}

export interface GenerationBatch {
  id: string;
  categoryName: string;
  targetCount: number;
  generatedCount: number;
  validCount: number;
  invalidCount: number;
  createdAt: string;
}

export interface DuplicateReviewItem {
  id: string;
  newWorkflowName: string;
  newWorkflowPath: string;
  existingWorkflowId: string;
  existingWorkflowName: string;
  similarityScore: number;
  reasons: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
