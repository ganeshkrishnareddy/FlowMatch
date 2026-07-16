import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Plug, RefreshCw } from 'lucide-react';

interface IntegrationInfo {
  name: string;
  slug: string;
  count?: number;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'count' | 'alpha'>('count');
  const [loading, setLoading] = useState(true);
  const perPage = 48;

  useEffect(() => {
    fetch('/data/indexed-workflows/index.json')
      .then(res => res.json())
      .then(data => {
        const ints = (data.integrations || []).map((i: any) => ({
          name: i.name,
          slug: i.slug,
          count: i.count || 0,
        }));
        setIntegrations(ints);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = integrations
    .filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortBy === 'count' ? (b.count || 0) - (a.count || 0) : a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Top 10 popular
  const popular = [...integrations].sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 10);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Plug className="h-7 w-7 text-violet-500" />
          Integrations Directory
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Browse n8n workflows by connected service and integration.</p>
      </div>

      {/* Popular integrations */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Popular Integrations</h2>
        <div className="flex flex-wrap gap-2">
          {popular.map(p => (
            <Link
              key={p.slug}
              to={`/integration/${p.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-violet-950/20 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-950/40 transition-colors"
            >
              <span>{p.name}</span>
              <span className="text-violet-400 dark:text-violet-600">({p.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 py-2 pl-9 pr-4 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setSortBy('count'); setPage(1); }} className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${sortBy === 'count' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800'}`}>
            By Workflow Count
          </button>
          <button onClick={() => { setSortBy('alpha'); setPage(1); }} className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${sortBy === 'alpha' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800'}`}>
            A–Z
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-400">{filtered.length} integrations • Page {page} of {totalPages || 1}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {paginated.map(integration => (
          <Link
            key={integration.slug}
            to={`/integration/${integration.slug}`}
            className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 hover:border-violet-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-none transition-all duration-200 text-center space-y-1 shadow-sm"
          >
            <div className="text-sm font-bold text-slate-800 dark:text-white truncate">{integration.name}</div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{integration.count || 0} templates</div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-900 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="inline-flex items-center gap-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="inline-flex items-center gap-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-40 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
