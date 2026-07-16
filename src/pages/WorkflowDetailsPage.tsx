import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Copy, Share2, Shield, Award, HelpCircle, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { workflowRepository } from '../repositories';
import { Workflow } from '../types/workflow';
import WorkflowGraph from '../components/workflow/WorkflowGraph';
import { injectStickyNote } from '../services/stickyNoteInjector';

export default function WorkflowDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'instructions' | 'security' | 'json' | 'attribution'>('overview');
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    // Load full workflow JSON including details
    fetch(`/data/indexed-workflows/details/${slug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Workflow not found');
        return res.json();
      })
      .then((data) => {
        setWorkflow(data);
        setLoading(false);
        // Track view trigger
        workflowRepository.incrementViewCount(data.id).catch(console.error);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleCopyJson = () => {
    if (!workflow) return;
    setCopying(true);
    const enrichedJson = injectStickyNote(workflow.originalWorkflowJson, workflow);
    navigator.clipboard.writeText(JSON.stringify(enrichedJson, null, 2))
      .then(() => setTimeout(() => setCopying(false), 2000))
      .catch(() => setCopying(false));
  };

  const handleDownloadJson = () => {
    if (!workflow) return;
    const enrichedJson = injectStickyNote(workflow.originalWorkflowJson, workflow);
    const blob = new Blob([JSON.stringify(enrichedJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.slug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    workflowRepository.incrementDownloadCount(workflow.id).catch(console.error);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-zinc-500 text-sm">Loading workflow specifications...</p>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="text-center py-24 max-w-md mx-auto space-y-4">
        <HelpCircle className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Workflow Not Found</h2>
        <p className="text-sm text-zinc-500">The requested workflow configuration could not be located in our indexed blueprints.</p>
        <Link to="/workflows" className="inline-block bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded text-sm text-zinc-800 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link to="/workflows" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Directory</span>
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 border-b border-zinc-200 dark:border-zinc-900 pb-8">
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded">
              {workflow.difficulty}
            </span>
            <span className="text-[10px] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded">
              {workflow.estimatedSetupTime} setup
            </span>
            {workflow.verified && (
              <span className="flex items-center gap-0.5 text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded">
                <CheckCircle className="h-3 w-3" />
                <span>Verified Quality</span>
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">{workflow.name}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">{workflow.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button
            onClick={handleDownloadJson}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 transition-all"
          >
            <Download className="h-4.5 w-4.5" />
            <span>Download JSON</span>
          </button>
          <button
            onClick={handleCopyJson}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
          >
            <Copy className="h-4.5 w-4.5" />
            <span>{copying ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="border-b border-zinc-200 dark:border-zinc-850">
        <div className="flex flex-wrap -mb-px text-sm font-medium text-center text-zinc-500 dark:text-zinc-400">
          {(['overview', 'preview', 'instructions', 'security', 'json', 'attribution'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-block p-4 border-b-2 rounded-t-lg transition-all capitalize ${
                activeTab === tab
                  ? 'border-violet-600 dark:border-violet-500 text-zinc-900 dark:text-white font-semibold'
                  : 'border-transparent hover:text-zinc-700 dark:hover:text-zinc-350 hover:border-zinc-300 dark:hover:border-zinc-800'
              }`}
            >
              {tab === 'json' ? 'Workflow JSON' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[300px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/10 space-y-3">
                <h3 className="text-zinc-900 dark:text-white font-bold">Workflow Actions</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  {workflow.shortDescription || 'This workflow connects automation services to run processes dynamically.'}
                </p>
              </div>

              {/* Integrations Used */}
              <div className="space-y-3">
                <h3 className="text-zinc-900 dark:text-white font-bold text-sm">Integrations Used</h3>
                <div className="flex flex-wrap gap-2">
                  {workflow.integrations.map((integration, idx) => (
                    <span key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold">
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/10 space-y-4 text-sm">
                <h3 className="text-zinc-900 dark:text-white font-bold">Metadata Specs</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-900">
                    <span className="text-zinc-500">Nodes Count</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{workflow.nodeCount} Nodes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-900">
                    <span className="text-zinc-500">Difficulty</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{workflow.difficulty}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-900">
                    <span className="text-zinc-500">Setup Time</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{workflow.estimatedSetupTime}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-900">
                    <span className="text-zinc-500">Validation Status</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{workflow.validationStatus}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-900">
                    <span className="text-zinc-500">Quality Grade</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{workflow.qualityScore}/100</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">Downloads</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{workflow.downloadCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visual Preview Tab */}
        {activeTab === 'preview' && (
          <div className="h-[450px] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <WorkflowGraph workflowJson={workflow.originalWorkflowJson} />
          </div>
        )}

        {/* Setup Instructions Tab */}
        {activeTab === 'instructions' && workflow.instructions && (
          <div className="space-y-8 max-w-4xl">
            {/* Prerequisites */}
            <div className="space-y-3">
              <h3 className="text-zinc-900 dark:text-white font-bold text-base border-l-2 border-violet-500 pl-2">Prerequisites</h3>
              <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pl-1">
                {workflow.instructions.prerequisites.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Required Credentials */}
            <div className="space-y-3">
              <h3 className="text-zinc-900 dark:text-white font-bold text-base border-l-2 border-violet-500 pl-2">Required Credentials</h3>
              <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pl-1">
                {workflow.instructions.requiredCredentials.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Configuration Steps */}
            <div className="space-y-4">
              <h3 className="text-zinc-900 dark:text-white font-bold text-base border-l-2 border-violet-500 pl-2">Configuration Steps</h3>
              <div className="space-y-3 pl-1">
                {workflow.instructions.configurationSteps.map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 shadow-sm">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed self-center">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testing steps */}
            <div className="space-y-3">
              <h3 className="text-zinc-900 dark:text-white font-bold text-base border-l-2 border-violet-500 pl-2">Testing Steps</h3>
              <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pl-1">
                {workflow.instructions.testingSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Expected Result */}
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
              <span className="font-bold text-zinc-900 dark:text-white">Expected Output: </span>
              {workflow.instructions.expectedResult}
            </div>
          </div>
        )}

        {/* Security Scan Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
              <Shield className={`h-8 w-8 ${workflow.securityStatus === 'Passed' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`} />
              <div>
                <h3 className="text-zinc-900 dark:text-white font-bold text-lg">Security Scan: {workflow.securityStatus}</h3>
                <p className="text-zinc-500 dark:text-zinc-450 text-xs">Automated security scanning inspects node configurations and does not guarantee execution safety.</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4 shadow-sm">
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Automated Scan Summary</h4>
              <div className="text-xs text-zinc-650 dark:text-zinc-300 space-y-2">
                <div>🔒 No hardcoded plain-text credential API keys found.</div>
                <div>📡 External URLs and HTTP Request configurations analyzed.</div>
                <div>⚡ Custom Javascript / Code nodes scanned for injection indicators.</div>
              </div>
            </div>
          </div>
        )}

        {/* Workflow JSON Tab */}
        {activeTab === 'json' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-xs">Raw n8n Workflow JSON blueprint configuration</span>
              <button
                onClick={handleCopyJson}
                className="inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-white transition-colors"
              >
                <Copy className="h-4.5 w-4.5" />
                <span>{copying ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-350 text-xs overflow-x-auto max-h-[450px] shadow-lg">
              <code>{JSON.stringify(workflow.originalWorkflowJson, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* Source & Attribution Tab */}
        {activeTab === 'attribution' && workflow.sources && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4">
              <h3 className="text-zinc-900 dark:text-white font-bold text-base">Attribution and Provenance</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                This workflow is indexed from public, open-source repositories. FlowMatch does not claim authorship.
              </p>

              {workflow.sources.map((src, i) => (
                <div key={i} className="text-xs text-zinc-500 dark:text-zinc-400 space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-900">
                  <div>📁 Source Repository: <a href={src.sourceRepository} target="_blank" rel="noreferrer" className="text-violet-600 dark:text-violet-400 underline">{src.sourceName}</a></div>
                  <div>📄 File Path: <code className="bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded text-zinc-700 dark:text-zinc-300">{src.sourceFilePath}</code></div>
                  {src.sourceUrl && (
                    <div>🔗 Link: <a href={src.sourceUrl} target="_blank" rel="noreferrer" className="text-violet-600 dark:text-violet-400 underline">Original JSON Source File</a></div>
                  )}
                  <div>📜 License: <span className="text-zinc-800 dark:text-zinc-300 font-semibold">{src.sourceLicense || 'MIT License'}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Widget */}
      <div className="mt-8 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Was this workflow useful?</h4>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">Help us improve by providing quick, anonymous feedback.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (workflow) {
                workflowRepository.submitFeedback(workflow.id, 'useful');
                alert('Thank you for your feedback!');
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
          >
            Yes, Useful
          </button>
          <button
            onClick={() => {
              if (workflow) {
                workflowRepository.submitFeedback(workflow.id, 'needs_improvement');
                alert('Thank you! We will look into improving this template.');
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all border border-zinc-300 dark:border-zinc-700 shadow-sm"
          >
            Needs Improvement
          </button>
        </div>
      </div>
    </div>
  );
}
