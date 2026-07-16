import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Clock, Layers, HelpCircle, Download, FileText, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { workflowRepository } from '../repositories';
import { rankMatchingWorkflows } from '../services/workflowMatcher';
import { WorkflowMatch } from '../types/workflow';

export default function AIMatchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matches, setMatches] = useState<WorkflowMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryParam = searchParams.get('q') || '';
  const [inputVal, setInputVal] = useState(queryParam);
  const [hasSearched, setHasSearched] = useState(!!queryParam);

  useEffect(() => {
    setInputVal(queryParam);
    if (!queryParam.trim()) {
      setMatches([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    // Load all workflows for local matching
    workflowRepository.searchWorkflows('', { sortBy: 'newest' }, 1, 5000)
      .then(res => {
        const ranked = rankMatchingWorkflows(queryParam, res.workflows);
        setMatches(ranked.slice(0, 10)); // return top 10 matches
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load workflows for matching.');
        setLoading(false);
      });
  }, [queryParam]);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  const handleDownload = (w: any) => {
    const blob = new Blob([JSON.stringify(w.originalWorkflowJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${w.slug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    workflowRepository.incrementDownloadCount(w.id).catch(console.error);
  };

  return (
    <div className="space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center justify-center gap-2">
          <Sparkles className="h-7 w-7 text-violet-500" />
          <span>AI Matching Interface</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Describe your automation process and we will find the closest workflow template matching your needs.</p>
      </div>

      {/* Prompter Form */}
      <form onSubmit={handlePromptSubmit} className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <textarea
            rows={3}
            placeholder="I run a real estate agency and want WhatsApp leads automatically saved to Google Sheets and followed up using AI..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="absolute bottom-4 right-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg px-4 py-2 text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 transition-colors disabled:opacity-50"
          >
            Find My Workflow
          </button>
        </div>

        {/* Debug Toggle */}
        {import.meta.env.DEV && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowDebug(!showDebug)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
            >
              {showDebug ? <ToggleRight className="h-5 w-5 text-violet-500" /> : <ToggleLeft className="h-5 w-5" />}
              <span>Admin Score Debug Mode</span>
            </button>
          </div>
        )}
      </form>

      {/* Matching Results Grid */}
      <div className="max-w-3xl mx-auto space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/10">
            <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
            <p className="text-zinc-500 text-sm font-medium">Analyzing templates and calculating match scores...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-dashed border-red-200 dark:border-red-900/30 rounded-xl bg-red-50 dark:bg-red-900/10">
            <Shield className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-red-700 dark:text-red-400 font-bold">Error</h3>
            <p className="text-xs text-red-600 dark:text-red-300 mt-1">{error}</p>
          </div>
        ) : !hasSearched ? (
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/5">
            <Sparkles className="h-8 w-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
            <h3 className="text-zinc-600 dark:text-zinc-400 font-bold">Describe Your Automation</h3>
            <p className="text-xs text-zinc-500 mt-1">Enter your process logic in the input box above to trigger the AI Match engine.</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/5">
            <HelpCircle className="h-8 w-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
            <h3 className="text-zinc-600 dark:text-zinc-400 font-bold">No Matches Found</h3>
            <p className="text-xs text-zinc-500 mt-1">We could not resolve any indexed templates matching your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map(({ workflow: w, matchScore, matchReason }) => (
              <div
                key={w.id}
                className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4 hover:border-violet-300 dark:hover:border-zinc-750 transition-all shadow-sm dark:shadow-none"
              >
                {/* Score bar */}
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/25 px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    <span>{matchScore.total}% MATCH</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Cpu className="h-3.5 w-3.5" />{w.nodeCount} Nodes</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{w.estimatedSetupTime}</span>
                  </div>
                </div>

                {/* Workflow Detail */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">{w.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{w.description}</p>
                </div>

                {/* Why this matches section */}
                <div className="p-3.5 rounded-lg bg-violet-50/50 dark:bg-zinc-900/40 border border-violet-100 dark:border-zinc-850/80 text-xs text-slate-800 dark:text-zinc-350 leading-relaxed">
                  <span className="font-bold text-violet-900 dark:text-white block mb-1">Why this matches:</span>
                  {matchReason}
                </div>

                {/* Debug Score Breakdown Panel */}
                {showDebug && (
                  <div className="p-3 rounded bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-300 dark:border-violet-900/20 text-[10px] font-mono text-zinc-600 dark:text-zinc-500 grid grid-cols-5 gap-2">
                    <div>🔌 Integrations: {matchScore.integrationScore}/40</div>
                    <div>🔑 Keywords: {matchScore.keywordScore}/25</div>
                    <div>📁 Category: {matchScore.categoryScore}/15</div>
                    <div>⚡ Trigger: {matchScore.triggerScore}/10</div>
                    <div>⚙️ Complexity: {matchScore.complexityScore}/10</div>
                  </div>
                )}

                {/* Integrations icons and buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-900">
                  <div className="flex flex-wrap gap-1">
                    {w.integrations.map((integration, idx) => (
                      <span key={idx} className="text-[9px] bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded font-medium">
                        {integration}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/workflow/${w.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 px-3.5 py-1.5 rounded-lg shadow-sm"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Details</span>
                    </Link>
                    <button
                      onClick={() => handleDownload(w)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-3.5 py-1.5 rounded-lg shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
