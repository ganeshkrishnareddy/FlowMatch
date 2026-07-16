import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid3x3, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { workflowRepository } from '../repositories';
import { Workflow } from '../types/workflow';
import WorkflowCard from '../components/workflow/WorkflowCard';

interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
}

const CATEGORY_META: Record<string, { icon: string; description: string }> = {
  'marketing': { icon: '📣', description: 'Automate social media postings, campaign monitoring, and marketing operations.' },
  'sales': { icon: '💼', description: 'Manage leads, pipeline alerts, customer relation updates, and CRM syncs.' },
  'lead-generation': { icon: '🎯', description: 'Route, score, and qualify incoming website leads and contact forms.' },
  'cybersecurity': { icon: '🛡️', description: 'Defensive monitoring, security information triage, and SOC incident management.' },
  'it-operations': { icon: '⚙️', description: 'Server monitoring, database maintenance, backups, and user provisioning.' },
  'data-analytics': { icon: '📊', description: 'Track KPIs, aggregate metrics, update dashboards, and generate reports.' },
  'customer-support': { icon: '🎧', description: 'Handle support tickets, follow up on feedback, and alert support staff.' },
  'productivity': { icon: '⚡', description: 'General utilities, file conversions, workspace organization, and quick integrations.' },
  'e-commerce': { icon: '🛒', description: 'Process orders, update inventories, sync storefronts, and track payments.' },
  'hr-recruitment': { icon: '👥', description: 'Automate employee onboarding, candidate tracking, and payroll processing.' },
  'google-workspace': { icon: '📧', description: 'Sync Gmail inbox actions, Google Sheets rows, and Google Drive backups.' },
  'microsoft-365': { icon: '💻', description: 'Automate Outlook emails, OneDrive uploads, and MS Teams alerts.' },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/data/indexed-workflows/index.json').then(res => res.json()),
      workflowRepository.getWorkflows({}, 1, 1500)
    ]).then(([indexData, wfRes]) => {
      const rawCats = (indexData.categories || []).map((c: any) => ({
        name: c.name,
        slug: c.slug,
        count: c.count || 0,
      }));
      setCategories(rawCats);
      setWorkflows(wfRes.workflows);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading categories and workflows...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Grid3x3 className="h-7 w-7 text-violet-500" />
          <span>Browse Automation Categories</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Explore n8n workflows by business process, team, and automation use case.</p>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 py-2 pl-9 pr-4 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
        />
      </div>

      <div className="space-y-16">
        {filteredCategories.map(cat => {
          const catMeta = CATEGORY_META[cat.slug] || { icon: '📁', description: 'Automate business tasks and operations with custom rules.' };
          const catWorkflows = workflows
            .filter(w => w.categoryId === cat.slug)
            .slice(0, 6);

          return (
            <div key={cat.slug} className="space-y-6">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
                <div className="flex items-start gap-3.5">
                  <span className="text-3xl p-1 bg-slate-50 dark:bg-zinc-900 rounded-xl" role="img" aria-label={cat.name}>
                    {catMeta.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h2>
                      <span className="text-[10px] font-bold text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        {cat.count} template{cat.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-450 mt-1 max-w-xl">
                      {catMeta.description}
                    </p>
                  </div>
                </div>
                
                <Link
                  to={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 self-start sm:self-center transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Workflows Grid */}
              {catWorkflows.length === 0 ? (
                <p className="text-xs text-zinc-450 italic pl-1">No templates in this category yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catWorkflows.map(w => (
                    <WorkflowCard key={w.id} workflow={w} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
