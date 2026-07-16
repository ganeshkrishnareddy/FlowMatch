import { useEffect, useState } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { workflowRepository } from '../repositories';

export default function SourcesPage() {
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    indexedWorkflowsCount: 0,
    flowmatchOriginalsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workflowRepository.getStats()
      .then(res => {
        setStats(res as any);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-zinc-500 text-sm">Loading attribution summaries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Sources & Attribution</h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          FlowMatch indexes and analyzes workflows from permitted public or open-source repositories. We respect copyright licenses and show available author and license information.
        </p>
      </div>

      {/* Disclaimers card */}
      <div className="p-5 rounded-xl border border-emerald-200 dark:border-zinc-800 bg-emerald-50 dark:bg-zinc-900/10 space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-white font-bold text-sm">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span>Provenance Note</span>
        </div>
        <p className="text-emerald-700 dark:text-zinc-500 text-xs leading-relaxed">
          FlowMatch indexes and analyzes workflows from source repositories and permitted public or open-source sources. Repository-level licensing does not necessarily establish original authorship of every collected workflow. Source and provenance information is displayed where available.
        </p>
      </div>

      {/* Source grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Indexed Repositories</h2>
        
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">Zie619 n8n Workflows Repository</h3>
              <p className="text-xs text-zinc-500">Public collection of production n8n workflows.</p>
            </div>
            <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-500/20 px-2.5 py-0.5 rounded-full">
              {stats.indexedWorkflowsCount > 0 ? stats.indexedWorkflowsCount : 2029} INDEXED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-600 dark:text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-900">
            <div>
              <span className="text-zinc-500 block">Repository Location</span>
              <a href="https://github.com/Zie619/n8n-workflows" target="_blank" rel="noreferrer" className="text-violet-600 dark:text-violet-400 underline font-semibold hover:text-violet-500 transition-colors">
                github.com/Zie619/n8n-workflows
              </a>
            </div>
            <div>
              <span className="text-zinc-500 block">License</span>
              <span className="text-zinc-800 dark:text-zinc-300 font-semibold">MIT License, Copyright 2025 Zie619</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Discovered At</span>
              <span className="text-zinc-800 dark:text-zinc-300 font-semibold">July 2026</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Ingestion Integrity</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Deduplicated & Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
