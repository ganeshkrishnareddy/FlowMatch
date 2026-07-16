import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Workflow, DifficultyType, SecurityStatusType } from '../types/workflow';
import { WorkflowRepository, WorkflowFilters, SearchFilters } from './WorkflowRepository';

// Initialize supabase client if variables exist
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

export class SupabaseWorkflowRepository implements WorkflowRepository {
  private client = supabase;

  private mapDbToWorkflow(row: any): Workflow {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      shortDescription: row.short_description,
      originalWorkflowJson: row.original_workflow_json,
      normalizedWorkflowJson: row.normalized_workflow_json,
      nodeCount: row.node_count,
      integrationCount: row.integration_count,
      difficulty: row.difficulty as DifficultyType,
      estimatedSetupTime: row.estimated_setup_time,
      categoryId: row.category_id,
      category: row.categories ? {
        id: row.categories.id,
        name: row.categories.name,
        slug: row.categories.slug,
        description: row.categories.description,
        icon: row.categories.icon,
      } : undefined,
      integrations: row.workflow_integrations?.map((wi: any) => wi.integrations?.name).filter(Boolean) || [],
      securityStatus: row.security_status as SecurityStatusType,
      verified: row.verified,
      featured: row.featured,
      downloadCount: row.download_count,
      viewCount: row.view_count,
      workflowOrigin: row.workflow_origin,
      instructionStatus: row.instruction_status,
      instructions: row.setup_instructions ? {
        prerequisites: row.prerequisites || [],
        setupInstructions: row.setup_instructions || [],
        requiredAccounts: row.required_accounts || [],
        requiredCredentials: row.required_credentials || [],
        configurationSteps: row.configuration_steps || [],
        testingSteps: row.testing_steps || [],
        expectedResult: row.expected_result || '',
        troubleshooting: row.troubleshooting || [],
        securityNotes: row.security_notes || [],
      } : undefined,
      qualityScore: row.quality_score,
      validationStatus: row.validation_status,
      provenanceStatus: row.provenance_status,
      importBatch: row.import_batch,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getWorkflows(filters: WorkflowFilters, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }> {
    let query = this.client
      .from('workflows')
      .select('*, categories(*), workflow_integrations(integrations(*))', { count: 'exact' });

    query = this.applyFiltersToQuery(query, filters);

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      workflows: (data || []).map(row => this.mapDbToWorkflow(row)),
      total: count || 0,
    };
  }

  async getWorkflowById(id: string): Promise<Workflow | null> {
    const { data, error } = await this.client
      .from('workflows')
      .select('*, categories(*), workflow_integrations(integrations(*))')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No row found
      throw error;
    }
    return this.mapDbToWorkflow(data);
  }

  async getWorkflowBySlug(slug: string): Promise<Workflow | null> {
    const { data, error } = await this.client
      .from('workflows')
      .select('*, categories(*), workflow_integrations(integrations(*))')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return this.mapDbToWorkflow(data);
  }

  async searchWorkflows(searchQuery: string, filters: SearchFilters, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }> {
    let query = this.client
      .from('workflows')
      .select('*, categories(*), workflow_integrations(integrations(*))', { count: 'exact' });

    query = this.applyFiltersToQuery(query, filters);

    if (searchQuery.trim()) {
      // Use Postgres Full Text Search via the search_vector field
      query = query.textSearch('search_vector', searchQuery);
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Apply sorting
    if (filters.sortBy === 'popular' || filters.sortBy === 'downloads') {
      query = query.order('download_count', { ascending: false });
    } else if (filters.sortBy === 'quality') {
      query = query.order('quality_score', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, count, error } = await query.range(from, to);
    if (error) throw error;

    return {
      workflows: (data || []).map(row => this.mapDbToWorkflow(row)),
      total: count || 0,
    };
  }

  async getFeaturedWorkflows(limit: number): Promise<Workflow[]> {
    const { data, error } = await this.client
      .from('workflows')
      .select('*, categories(*), workflow_integrations(integrations(*))')
      .eq('featured', true)
      .limit(limit);

    if (error) throw error;
    return (data || []).map(row => this.mapDbToWorkflow(row));
  }

  async getWorkflowsByCategory(categorySlug: string, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }> {
    // Get category first
    const { data: cat } = await this.client.from('categories').select('id').eq('slug', categorySlug).single();
    if (!cat) return { workflows: [], total: 0 };
    return this.getWorkflows({ category: cat.id }, page, perPage);
  }

  async getWorkflowsByIntegration(integrationSlug: string, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }> {
    // We join through workflow_integrations mapping table
    const { data: wi, error } = await this.client
      .from('workflow_integrations')
      .select('workflow_id, integrations!inner(slug)')
      .eq('integrations.slug', integrationSlug);

    if (error || !wi || wi.length === 0) return { workflows: [], total: 0 };

    const ids = wi.map((row: any) => row.workflow_id);

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, count, error: wError } = await this.client
      .from('workflows')
      .select('*, categories(*), workflow_integrations(integrations(*))', { count: 'exact' })
      .in('id', ids)
      .range(from, to);

    if (wError) throw wError;

    return {
      workflows: (data || []).map(row => this.mapDbToWorkflow(row)),
      total: count || 0,
    };
  }

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const dbObj = this.mapWorkflowToDb(workflow);
    const { data, error } = await this.client
      .from('workflows')
      .insert([dbObj])
      .select()
      .single();

    if (error) throw error;
    return this.mapDbToWorkflow(data);
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    const dbObj = this.mapWorkflowToDb(workflow);
    const { data, error } = await this.client
      .from('workflows')
      .update(dbObj)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbToWorkflow(data);
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('workflows')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.client.rpc('increment_workflow_views', { workflow_id: id });
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await this.client.rpc('increment_workflow_downloads', { workflow_id: id });
  }

  async submitFeedback(id: string, feedbackType: 'useful' | 'needs_improvement'): Promise<void> {
    await this.client.from('workflow_feedback').insert([{ workflow_id: id, feedback_type: feedbackType }]);
  }

  async getStats() {
    const { count: totalWorkflows } = await this.client.from('workflows').select('*', { count: 'exact', head: true });
    const { count: verifiedWorkflows } = await this.client.from('workflows').select('*', { count: 'exact', head: true }).eq('verified', true);
    const { count: integrationsCount } = await this.client.from('integrations').select('*', { count: 'exact', head: true });
    const { count: categoriesCount } = await this.client.from('categories').select('*', { count: 'exact', head: true });

    // Download/View sums can be fetched or set to default if empty
    return {
      totalWorkflows: totalWorkflows || 0,
      activeWorkflows: totalWorkflows || 0,
      verifiedWorkflows: verifiedWorkflows || 0,
      totalDownloads: 0,
      totalViews: 0,
      integrationsCount: integrationsCount || 0,
      categoriesCount: categoriesCount || 0,
    };
  }

  private applyFiltersToQuery(query: any, filters: WorkflowFilters): any {
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      query = query.eq('difficulty', filters.difficulty);
    }
    if (filters.securityStatus && filters.securityStatus !== 'all') {
      query = query.eq('security_status', filters.securityStatus);
    }
    if (filters.verifiedOnly) {
      query = query.eq('verified', true);
    }
    if (filters.featuredOnly) {
      query = query.eq('featured', true);
    }
    return query;
  }

  private mapWorkflowToDb(w: Partial<Workflow>): any {
    return {
      name: w.name,
      slug: w.slug,
      description: w.description,
      short_description: w.shortDescription,
      original_workflow_json: w.originalWorkflowJson,
      normalized_workflow_json: w.normalizedWorkflowJson,
      node_count: w.nodeCount,
      integration_count: w.integrationCount,
      difficulty: w.difficulty,
      estimated_setup_time: w.estimatedSetupTime,
      category_id: w.categoryId,
      security_status: w.securityStatus,
      verified: w.verified,
      featured: w.featured,
      workflow_origin: w.workflowOrigin,
      instruction_status: w.instructionStatus,
      prerequisites: w.instructions?.prerequisites,
      setup_instructions: w.instructions?.setupInstructions,
      required_credentials: w.instructions?.requiredCredentials,
      configuration_steps: w.instructions?.configurationSteps,
      testing_steps: w.instructions?.testingSteps,
      expected_result: w.instructions?.expectedResult,
      troubleshooting: w.instructions?.troubleshooting,
      security_notes: w.instructions?.securityNotes,
      quality_score: w.qualityScore,
      validation_status: w.validationStatus,
      provenance_status: w.provenanceStatus,
      import_batch: w.importBatch,
    };
  }
}
