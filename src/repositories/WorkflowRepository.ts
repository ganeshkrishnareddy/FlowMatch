import { Workflow, DifficultyType, SecurityStatusType } from '../types/workflow';

export interface WorkflowFilters {
  category?: string;
  integration?: string;
  difficulty?: DifficultyType | 'all';
  securityStatus?: SecurityStatusType | 'all';
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  aiOnly?: boolean;
  triggerType?: string | 'all';
}

export interface SearchFilters extends WorkflowFilters {
  sortBy?: 'best_match' | 'popular' | 'newest' | 'downloads' | 'quality';
}

export interface WorkflowRepository {
  getWorkflows(filters: WorkflowFilters, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }>;
  getWorkflowById(id: string): Promise<Workflow | null>;
  getWorkflowBySlug(slug: string): Promise<Workflow | null>;
  searchWorkflows(query: string, filters: SearchFilters, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }>;
  getFeaturedWorkflows(limit: number): Promise<Workflow[]>;
  getWorkflowsByCategory(categorySlug: string, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }>;
  getWorkflowsByIntegration(integrationSlug: string, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }>;
  createWorkflow(workflow: Partial<Workflow>): Promise<Workflow>;
  updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow>;
  deleteWorkflow(id: string): Promise<boolean>;
  incrementViewCount(id: string): Promise<void>;
  incrementDownloadCount(id: string): Promise<void>;
  submitFeedback(id: string, feedbackType: 'useful' | 'needs_improvement'): Promise<void>;
  getStats(): Promise<{
    totalWorkflows: number;
    activeWorkflows: number;
    verifiedWorkflows: number;
    totalDownloads: number;
    totalViews: number;
    integrationsCount: number;
    categoriesCount: number;
  }>;
}
