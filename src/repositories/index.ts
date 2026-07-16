import { WorkflowRepository } from './WorkflowRepository';
import { MockWorkflowRepository } from './MockWorkflowRepository';
import { SupabaseWorkflowRepository } from './SupabaseWorkflowRepository';

const dataProvider = (typeof window !== 'undefined' ? import.meta.env?.VITE_DATA_PROVIDER : null) || 'mock';

export const workflowRepository: WorkflowRepository = dataProvider === 'supabase'
  ? new SupabaseWorkflowRepository()
  : new MockWorkflowRepository();

export * from './WorkflowRepository';
export * from './MockWorkflowRepository';
export * from './SupabaseWorkflowRepository';
