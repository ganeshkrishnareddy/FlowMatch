import { useEffect, useState } from 'react';
import { Play, ShieldAlert, Cpu, FileJson, CheckSquare, Layers, AlertCircle } from 'lucide-react';

interface ReportStats {
  filesScanned: number;
  validWorkflows: number;
  invalidWorkflows: number;
  exactDuplicates: number;
  possibleDuplicates: number;
  uniqueWorkflows: number;
  integrationsDetected: number;
  categoriesDetected: number;
  securityPassed: number;
  securityReviewRecommended: number;
  securityPotentialRisk: number;
  qualityScoreAverage: number;
}

export default function AdminImportPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/indexed-workflows/source-import-report.json')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 text-zinc-500 text-sm">
        Loading ingestion reports...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Admin Import Panel</h1>
        <p className="text-zinc-500 text-sm">Review baseline scans, deduplication processes, and quality distributions.</p>
      </div>

      {/* Grid Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Scanned</span>
            <div className="text-2xl font-extrabold text-white flex items-center gap-1.5">
              <FileJson className="h-5 w-5 text-violet-400" />
              <span>{stats.filesScanned}</span>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Unique Imported</span>
            <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-1.5">
              <CheckSquare className="h-5 w-5" />
              <span>{stats.uniqueWorkflows}</span>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Duplicates Skipped</span>
            <div className="text-2xl font-extrabold text-zinc-400 flex items-center gap-1.5">
              <Layers className="h-5 w-5" />
              <span>{stats.exactDuplicates}</span>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Avg Quality Score</span>
            <div className="text-2xl font-extrabold text-violet-400 flex items-center gap-1.5">
              <Cpu className="h-5 w-5" />
              <span>{stats.qualityScoreAverage}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Security summary */}
      {stats && (
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 space-y-4">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <span>Security Scan Findings Summary</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded border border-zinc-850 bg-zinc-950/40 space-y-1">
              <span className="text-zinc-500">Passed</span>
              <div className="text-lg font-bold text-emerald-400">{stats.securityPassed} Workflows</div>
            </div>
            <div className="p-4 rounded border border-zinc-850 bg-zinc-950/40 space-y-1">
              <span className="text-zinc-500">Review Recommended</span>
              <div className="text-lg font-bold text-amber-400">{stats.securityReviewRecommended} Workflows</div>
            </div>
            <div className="p-4 rounded border border-zinc-850 bg-zinc-950/40 space-y-1">
              <span className="text-zinc-500">Potential Risk</span>
              <div className="text-lg font-bold text-rose-500">{stats.securityPotentialRisk} Workflows</div>
            </div>
          </div>
        </div>
      )}

      {/* Synchronize files panel */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 space-y-4">
        <h3 className="text-white font-bold text-base flex items-center gap-2">
          <Play className="h-5 w-5 text-violet-500" />
          <span>Synchronize Files</span>
        </h3>
        <p className="text-zinc-400 text-xs leading-relaxed">
          Filesystem access is restricted inside browser sandboxes. Running imports requires launching sync routines directly via the local terminal interface.
        </p>

        <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-850 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-2">
            <span className="text-zinc-500 font-mono">Sync CLI Command</span>
            <span className="text-violet-400 font-mono select-all">npx tsx scripts/import-source-workflows.ts</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <span>Ensure you run this command from the project root root directory to rebuild the local cache.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
