import { useEffect, useState } from 'react';
import { Play, Sparkles, Shield, Cpu, RefreshCw, FileText, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface GenReport {
  specificationsCreated: number;
  semanticDuplicatesRejected: number;
  replacementSpecificationsCreated: number;
  workflowJsonFilesGenerated: number;
  validWorkflows: number;
  invalidWorkflows: number;
  exactDuplicates: number;
  possibleDuplicates: number;
  securityPassed: number;
  securityReviewRecommended: number;
  securityPotentialRisk: number;
  averageQualityScore: number;
  publishedOriginalWorkflows: number;
  finalTotalIndexedWorkflows: number;
}

export default function AdminGeneratePage() {
  const [report, setReport] = useState<GenReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/indexed-workflows/original-workflow-generation-report.json')
      .then(res => res.json())
      .then(data => {
        setReport(data);
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
        <RefreshCw className="h-6 w-6 animate-spin text-violet-500 mr-2" />
        Loading generation metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-violet-550" />
          <span>Original Workflows Admin Control Panel</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Review, validate, and orchestrate the generation pipeline of FlowMatch Originals.</p>
      </div>

      {report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 space-y-1 shadow-sm dark:shadow-none">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Specs Loaded</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">{report.specificationsCreated}</div>
          </div>
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 space-y-1 shadow-sm dark:shadow-none">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Semantic Dups Skipped</span>
            <div className="text-2xl font-extrabold text-zinc-500 dark:text-zinc-400">{report.semanticDuplicatesRejected}</div>
          </div>
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 space-y-1 shadow-sm dark:shadow-none">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Published Originals</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{report.publishedOriginalWorkflows}</div>
          </div>
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 space-y-1 shadow-sm dark:shadow-none">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Combined Index</span>
            <div className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">{report.finalTotalIndexedWorkflows}</div>
          </div>
        </div>
      )}

      {/* Validation status cards */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4 shadow-sm dark:shadow-none">
            <h3 className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>Compilation & Integrity Validation</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded border border-zinc-200 dark:border-zinc-850">
                <span className="text-zinc-500 dark:text-zinc-400 block">Valid Nodes</span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">{report.validWorkflows}</span>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded border border-zinc-200 dark:border-zinc-850">
                <span className="text-zinc-500 dark:text-zinc-400 block">Structural Duplicates</span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">{report.exactDuplicates}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4 shadow-sm dark:shadow-none">
            <h3 className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                <span>Cybersecurity Policy Checks</span>
              </span>
            </h3>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded border border-zinc-200 dark:border-zinc-850">
                <span className="text-emerald-600 dark:text-emerald-400 block font-bold">Passed</span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">{report.securityPassed}</span>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded border border-zinc-200 dark:border-zinc-850">
                <span className="text-amber-600 dark:text-amber-400 block font-bold">Recommended</span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">{report.securityReviewRecommended}</span>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded border border-zinc-200 dark:border-zinc-850">
                <span className="text-rose-600 dark:text-rose-500 block font-bold font-mono">Risk Alert</span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">{report.securityPotentialRisk}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic orchestration panel */}
      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4 shadow-sm dark:shadow-none">
        <h3 className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
          <Play className="h-5 w-5 text-violet-550" />
          <span>Execute Ingestion Commands</span>
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
          The specifications parser runs structural validations, calculates scores, and publishes templates onto chunk files. Since browser sessions cannot read from or write to the filesystem directly, run commands through your CLI tool.
        </p>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-850 space-y-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
          <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-900 pb-2">
            <span className="text-zinc-500">1. Generate Specifications</span>
            <span className="text-zinc-700 dark:text-zinc-300">npx tsx scripts/generate-specs-data.ts</span>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-900 pb-2">
            <span className="text-zinc-500">2. Generate & Merge Originals</span>
            <span className="text-zinc-700 dark:text-zinc-300">npx tsx scripts/generate-original-workflows.ts</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">3. Compile Distributions Reports</span>
            <span className="text-zinc-700 dark:text-zinc-300">npx tsx scripts/generate-distribution-reports.ts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
