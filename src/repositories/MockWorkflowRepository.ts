import { Workflow } from '../types/workflow';
import { WorkflowRepository, WorkflowFilters, SearchFilters } from './WorkflowRepository';

interface IndexJson {
  totalWorkflows: number;
  chunks: string[];
  categories: Array<{ slug: string; name: string; count: number }>;
  integrations: Array<{ name: string; slug: string; count: number }>;
  generatedAt: string;
}

export class MockWorkflowRepository implements WorkflowRepository {
  private indexData: IndexJson | null = null;
  private workflowCache: Record<string, Workflow> = {};
  private loadedChunks: Set<string> = new Set();
  private publicPath = '/data/indexed-workflows';

  private async ensureIndex(): Promise<IndexJson> {
    if (this.indexData) return this.indexData;

    try {
      const response = await fetch(`${this.publicPath}/index.json`);
      this.indexData = await response.json();
    } catch (e) {
      console.warn('Local indexed dataset index.json not found, using empty mock dataset.', e);
      this.indexData = { totalWorkflows: 0, chunks: [], categories: [], integrations: [], generatedAt: new Date().toISOString() };
    }
    return this.indexData!;
  }

  private async loadChunk(chunkName: string): Promise<void> {
    if (this.loadedChunks.has(chunkName)) return;

    let workflows: Workflow[] = [];
    try {
      const response = await fetch(`${this.publicPath}/${chunkName}`);
      workflows = await response.json();
    } catch (e) {
      console.error(`Failed to load workflow chunk: ${chunkName}`, e);
    }

    for (const w of workflows) {
      this.workflowCache[w.id] = w;
      this.workflowCache[w.slug] = w; // Cache by slug too
    }
    this.loadedChunks.add(chunkName);
  }

  private async loadAllChunks(): Promise<Workflow[]> {
    const index = await this.ensureIndex();
    
    // Fetch all chunks in parallel for massive performance boost
    await Promise.all(
      index.chunks.map(chunk => this.loadChunk(chunk))
    );

    return Object.values(this.workflowCache).filter(
      (w, i, self) => self.findIndex(t => t.id === w.id) === i
    );
  }

  async getWorkflows(filters: WorkflowFilters, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }> {
    const allWorkflows = await this.loadAllChunks();
    const filtered = this.applyFilters(allWorkflows, filters);
    
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      workflows: filtered.slice(start, end),
      total: filtered.length,
    };
  }

  async getWorkflowById(id: string): Promise<Workflow | null> {
    await this.ensureIndex();
    if (this.workflowCache[id]) return this.workflowCache[id];
    // Load all to find it
    await this.loadAllChunks();
    return this.workflowCache[id] || null;
  }

  async getWorkflowBySlug(slug: string): Promise<Workflow | null> {
    await this.ensureIndex();
    if (this.workflowCache[slug]) return this.workflowCache[slug];
    // Load all to find it
    await this.loadAllChunks();
    return this.workflowCache[slug] || null;
  }

  async searchWorkflows(query: string, filters: SearchFilters, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }> {
    const allWorkflows = await this.loadAllChunks();
    let filtered = this.applyFilters(allWorkflows, filters);

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.shortDescription.toLowerCase().includes(q) ||
        w.integrations.some(i => i.toLowerCase().includes(q))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      if (filters.sortBy === 'popular' || filters.sortBy === 'downloads') {
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
      } else if (filters.sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (filters.sortBy === 'quality') {
        filtered.sort((a, b) => b.qualityScore - a.qualityScore);
      }
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      workflows: filtered.slice(start, end),
      total: filtered.length,
    };
  }

  async getFeaturedWorkflows(limit: number): Promise<Workflow[]> {
    const allWorkflows = await this.loadAllChunks();
    const ignoredIntegrations = ['sticky note', 'stickynote', 'set', 'merge', 'if', 'switch', 'code', 'split out', 'no operation', 'no-op'];
    
    const eligible = allWorkflows.filter(w => {
      // Basic quality gates
      const title = w.display_title || w.name || '';
      const desc = w.display_description || w.description || '';
      if (title.toLowerCase().endsWith('trigger workflow')) return false;
      if (desc.toLowerCase().includes('lmchatopenai') || desc.toLowerCase().includes('stickynote')) return false;
      if (w.validationStatus !== 'Valid') return false;
      if (w.securityStatus === 'Potential Risk') return false;
      if ((w.qualityScore || 0) < 85) return false;
      
      // Meaningful integration check
      const meaningfulInts = (w.integrations || []).filter(i => 
        !ignoredIntegrations.some(ign => i.toLowerCase().includes(ign))
      );
      if (meaningfulInts.length === 0) return false;
      
      return true;
    });

    const scored = eligible.map(w => {
      let score = (w.qualityScore || 0) * 0.3; // 30% quality score
      const title = w.display_title || w.name || '';
      const desc = w.display_description || w.description || '';
      
      // Title quality (20%)
      if (title && title.length > 25 && title.length < 95) {
        score += 20;
      }
      
      // Description quality (15%)
      if (desc && desc.length > 80 && desc.length < 240) {
        score += 15;
      }
      
      // Usefulness / integration variety (15%)
      if ((w.integrations || []).length >= 2) {
        score += 15;
      } else {
        score += 5;
      }

      // Instruction completeness (5%)
      if (w.instructions && w.instructions.configurationSteps?.length > 0) {
        score += 5;
      }

      return { workflow: w, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Enforce uniqueness and discard generic/duplicate titles
    const seenTitles = new Set<string>();
    const uniqueScored: typeof scored = [];

    for (const item of scored) {
      const title = (item.workflow.display_title || item.workflow.name || '').trim().toLowerCase();
      if (seenTitles.has(title)) continue;
      if (title.includes('trigger automated') || title.includes('manual trigger') || title === 'trigger workflow') continue;
      
      seenTitles.add(title);
      uniqueScored.push(item);
    }

    return uniqueScored.map(s => s.workflow).slice(0, limit);
  }

  async getWorkflowsByCategory(categorySlug: string, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }> {
    return this.getWorkflows({ category: categorySlug }, page, perPage);
  }

  async getWorkflowsByIntegration(integrationSlug: string, page: number, perPage: number): Promise<{ workflows: Workflow[]; total: number }> {
    return this.getWorkflows({ integration: integrationSlug }, page, perPage);
  }

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const fullWorkflow = {
      id: workflow.id || Math.random().toString(36).substr(2, 9),
      name: workflow.name || 'Untitled Workflow',
      slug: workflow.slug || 'untitled-workflow',
      description: workflow.description || '',
      shortDescription: workflow.shortDescription || '',
      originalWorkflowJson: workflow.originalWorkflowJson || {},
      normalizedWorkflowJson: workflow.normalizedWorkflowJson || {},
      nodeCount: workflow.nodeCount || 0,
      integrationCount: workflow.integrationCount || 0,
      difficulty: workflow.difficulty || 'Beginner',
      estimatedSetupTime: workflow.estimatedSetupTime || '5 Mins',
      integrations: workflow.integrations || [],
      securityStatus: workflow.securityStatus || 'Passed',
      verified: workflow.verified || false,
      featured: workflow.featured || false,
      downloadCount: workflow.downloadCount || 0,
      viewCount: workflow.viewCount || 0,
      workflowOrigin: workflow.workflowOrigin || 'flowmatch_original',
      instructionStatus: workflow.instructionStatus || 'flowmatch_original',
      instructions: workflow.instructions,
      qualityScore: workflow.qualityScore || 0,
      validationStatus: workflow.validationStatus || 'Valid',
      provenanceStatus: workflow.provenanceStatus || 'flowmatch_original',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...workflow,
    } as Workflow;

    this.workflowCache[fullWorkflow.id] = fullWorkflow;
    this.workflowCache[fullWorkflow.slug] = fullWorkflow;
    return fullWorkflow;
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    const existing = await this.getWorkflowById(id);
    if (!existing) throw new Error('Workflow not found');
    const updated = { ...existing, ...workflow, updatedAt: new Date().toISOString() } as Workflow;
    this.workflowCache[id] = updated;
    if (updated.slug) this.workflowCache[updated.slug] = updated;
    return updated;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const existing = await this.getWorkflowById(id);
    if (!existing) return false;
    delete this.workflowCache[id];
    delete this.workflowCache[existing.slug];
    return true;
  }

  async incrementViewCount(id: string): Promise<void> {
    const w = await this.getWorkflowById(id);
    if (w) w.viewCount++;
  }

  async incrementDownloadCount(id: string): Promise<void> {
    const w = await this.getWorkflowById(id);
    if (w) w.downloadCount++;
  }

  async submitFeedback(id: string, feedbackType: 'useful' | 'needs_improvement'): Promise<void> {
    const key = `feedback_${id}_${feedbackType}`;
    const count = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, (count + 1).toString());
  }

  async getStats() {
    const index = await this.ensureIndex();
    const allWorkflows = await this.loadAllChunks();
    const totalDownloads = allWorkflows.reduce((sum, w) => sum + (w.downloadCount || 0), 0);
    const totalViews = allWorkflows.reduce((sum, w) => sum + (w.viewCount || 0), 0);
    return {
      totalWorkflows: index.totalWorkflows || allWorkflows.length,
      activeWorkflows: allWorkflows.length,
      verifiedWorkflows: allWorkflows.filter(w => w.verified).length,
      totalDownloads,
      totalViews,
      integrationsCount: index.integrations.length,
      categoriesCount: index.categories.length,
      indexedWorkflowsCount: allWorkflows.filter(w => w.workflowOrigin === 'third_party_import').length,
      flowmatchOriginalsCount: allWorkflows.filter(w => w.workflowOrigin === 'flowmatch_original').length,
    };
  }

  private applyFilters(workflows: Workflow[], filters: WorkflowFilters): Workflow[] {
    return workflows.filter(w => {
      if (filters.category && w.categoryId !== filters.category) return false;
      if (filters.integration && !w.integrations.some(i => {
        const iSlug = i.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const fSlug = filters.integration?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return iSlug === fSlug;
      })) return false;
      if (filters.difficulty && filters.difficulty !== 'all' && w.difficulty !== filters.difficulty) return false;
      if (filters.securityStatus && filters.securityStatus !== 'all' && w.securityStatus !== filters.securityStatus) return false;
      if (filters.verifiedOnly && !w.verified) return false;
      if (filters.featuredOnly && !w.featured) return false;
      return true;
    });
  }
}
