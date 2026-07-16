import { useEffect, useState } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { workflowRepository } from '../repositories';
import { Workflow } from '../types/workflow';
import WorkflowCard from '../components/workflow/WorkflowCard';

interface Collection {
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  icon: string;
}

const collections: Collection[] = [
  { name: 'AI Starter Pack', slug: 'ai-starter-pack', description: 'Essential AI-powered automation workflows for getting started with OpenAI, LLMs, and intelligent processing.', keywords: ['OpenAI', 'AI'], icon: '🤖' },
  { name: 'Sales Automation Toolkit', slug: 'sales-automation-toolkit', description: 'Close deals faster with CRM syncs, lead scoring, and follow-up automations.', keywords: ['Sales', 'HubSpot', 'CRM'], icon: '💼' },
  { name: 'Lead Generation Stack', slug: 'lead-generation-stack', description: 'Capture, qualify, and route leads from multiple channels automatically.', keywords: ['Lead', 'Webhook'], icon: '🎯' },
  { name: 'SOC Analyst Automation Pack', slug: 'soc-analyst-pack', description: 'Security Operations Center workflows for alert triage, incident response, and threat intelligence.', keywords: ['Cybersecurity', 'Security', 'SOC'], icon: '🛡️' },
  { name: 'Cybersecurity Operations', slug: 'cybersecurity-operations', description: 'Defensive security monitoring, vulnerability tracking, and compliance reporting.', keywords: ['Cybersecurity', 'Monitor'], icon: '🔒' },
  { name: 'Real Estate Automation', slug: 'real-estate-automation', description: 'Property management, lead follow-ups, and client communication workflows for real estate professionals.', keywords: ['Real Estate', 'Property'], icon: '🏠' },
  { name: 'Agency Operations', slug: 'agency-operations', description: 'Client reporting, project tracking, and deliverable automation for agencies.', keywords: ['Agency', 'Client', 'Report'], icon: '🏢' },
  { name: 'Freelancer Productivity', slug: 'freelancer-productivity', description: 'Time tracking, invoice management, and client communication for independent professionals.', keywords: ['Freelancer', 'Invoice'], icon: '💻' },
  { name: 'Startup Founder Stack', slug: 'startup-founder-stack', description: 'Investor updates, product metrics, and growth automation for early-stage founders.', keywords: ['Startup', 'Founder'], icon: '🚀' },
  { name: 'E-commerce Operations', slug: 'ecommerce-operations', description: 'Order processing, inventory alerts, and customer notification workflows for online stores.', keywords: ['Shopify', 'WooCommerce', 'E-commerce'], icon: '🛒' },
];

export default function CollectionsPage() {
  const [collectionWorkflows, setCollectionWorkflows] = useState<Record<string, Workflow[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch index.json and get workflows for each collection keywords
    workflowRepository.getWorkflows({}, 1, 1000)
      .then(res => {
        const map: Record<string, Workflow[]> = {};
        
        collections.forEach(col => {
          map[col.slug] = res.workflows.filter(w => {
            const text = `${w.name} ${w.description} ${w.integrations.join(' ')}`.toLowerCase();
            return col.keywords.some(kw => text.includes(kw.toLowerCase()));
          }).slice(0, 3); // Limit to 3 preview per collection
        });

        setCollectionWorkflows(map);
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
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading collections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-violet-500" />
          <span>Curated Collections</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Hand-picked workflow packs organized by role, industry, and use case.</p>
      </div>

      <div className="space-y-12">
        {collections.map((col) => {
          const workflows = collectionWorkflows[col.slug] || [];
          return (
            <div key={col.slug} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span className="text-2xl">{col.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{col.name}</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{col.description}</p>
                </div>
              </div>

              {workflows.length === 0 ? (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">No matching workflows indexed yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {workflows.map(w => (
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
