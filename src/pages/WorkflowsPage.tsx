import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Archive, Layers, Filter } from 'lucide-react';
import { workflowRepository, WorkflowFilters, SearchFilters } from '../repositories';
import { Workflow, DifficultyType } from '../types/workflow';
import WorkflowCard from '../components/workflow/WorkflowCard';

export default function WorkflowsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter lists
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([]);
  const [integrations, setIntegrations] = useState<Array<{ name: string; slug: string }>>([]);

  // Read URL params
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const integration = searchParams.get('integration') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const origin = searchParams.get('origin') || 'all';
  const verifiedOnly = searchParams.get('verified') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = 18;

  useEffect(() => {
    // Load metadata index for filter values
    fetch('/data/indexed-workflows/index.json')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setIntegrations(data.integrations || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const filters: SearchFilters = {
      category: category !== 'all' ? category : undefined,
      integration: integration !== 'all' ? integration : undefined,
      difficulty: difficulty !== 'all' ? (difficulty as DifficultyType) : undefined,
      verifiedOnly: verifiedOnly ? true : undefined,
      sortBy: 'newest',
    };

    workflowRepository.searchWorkflows(query, filters, page, perPage)
      .then(res => {
        setWorkflows(res.workflows);
        setTotal(res.total);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [query, category, integration, difficulty, origin, verifiedOnly, page]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'all' || value === '' || value === 'false') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // reset page
    setSearchParams(next);
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Layers className="h-7 w-7 text-violet-500" />
            <span>Workflow Directory</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Browse and filter indexed n8n automation workflows by category, integration, and difficulty.
          </p>
        </div>
        <div className="text-xs text-zinc-400 font-semibold bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded">
          Found {total} unique workflows
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold border-b border-zinc-200 dark:border-zinc-850 pb-3">
            <Filter className="h-4.5 w-4.5 text-violet-500" />
            <h2>Filters</h2>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Category</label>
            <select
              value={category}
              onChange={(e) => updateParam('category', e.target.value)}
              className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 focus:border-violet-500 focus:outline-none shadow-sm dark:shadow-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Integration Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Integration</label>
            <select
              value={integration}
              onChange={(e) => updateParam('integration', e.target.value)}
              className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 focus:border-violet-500 focus:outline-none shadow-sm dark:shadow-none"
            >
              <option value="all">All Integrations</option>
              {integrations.map((int) => (
                <option key={int.slug} value={int.name}>{int.name}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => updateParam('difficulty', e.target.value)}
              className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 focus:border-violet-500 focus:outline-none shadow-sm dark:shadow-none"
            >
              <option value="all">All Experience Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Workflow Origin Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Workflow Origin</label>
            <select
              value={origin}
              onChange={(e) => updateParam('origin', e.target.value)}
              className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 focus:border-violet-500 focus:outline-none shadow-sm dark:shadow-none"
            >
              <option value="all">All Workflows</option>
              <option value="flowmatch_original">FlowMatch Originals</option>
              <option value="third_party_import">Indexed Workflows</option>
            </select>
          </div>

          {/* Verified Badge Toggle */}
          <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-850 pt-4">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Verified Quality Only</label>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => updateParam('verified', e.target.checked.toString())}
              className="rounded border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-violet-600 focus:ring-violet-500 h-4 w-4"
            />
          </div>
        </div>

        {/* Grid and Workflows List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Search/Filters Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by keywords, integrations, triggers..."
              value={query}
              onChange={(e) => updateParam('q', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 py-3 pl-11 pr-4 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none shadow-sm dark:shadow-none"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="h-44 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/10 animate-pulse" />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/5">
              <AlertTriangle className="h-8 w-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-zinc-600 dark:text-zinc-400 font-bold">No Workflows Found</h3>
              <p className="text-xs text-zinc-500 mt-1">Try expanding your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflows.map((w) => (
                <WorkflowCard key={w.id} workflow={w} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-900 pt-6 mt-4">
              <button
                disabled={page === 1}
                onClick={() => updateParam('page', (page - 1).toString())}
                className="inline-flex items-center gap-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-40 transition-colors shadow-sm dark:shadow-none"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <span className="text-xs text-zinc-500">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => updateParam('page', (page + 1).toString())}
                className="inline-flex items-center gap-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-40 transition-colors shadow-sm dark:shadow-none"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
