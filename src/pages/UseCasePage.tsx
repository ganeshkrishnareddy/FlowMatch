import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Tag } from 'lucide-react';
import { workflowRepository } from '../repositories';
import { Workflow } from '../types/workflow';
import WorkflowCard from '../components/workflow/WorkflowCard';

const useCaseDefinitions: Record<string, { title: string; description: string; keywords: string[] }> = {
  'lead-generation': { title: 'Lead Generation Automation', description: 'Workflows that capture, qualify, and route incoming leads from web forms, ads, and messaging channels.', keywords: ['lead', 'qualify', 'capture', 'form'] },
  'email-automation': { title: 'Email Automation', description: 'Automated email workflows for follow-ups, drip campaigns, notifications, and inbox processing.', keywords: ['email', 'gmail', 'mail', 'send'] },
  'security-alerts': { title: 'Security Alert Automation', description: 'Cybersecurity monitoring, alert triage, and incident notification workflows.', keywords: ['security', 'alert', 'incident', 'soc', 'vulnerability'] },
  'real-estate-automation': { title: 'Real Estate Automation', description: 'Property listing management, lead follow-ups, and client communication workflows for real estate.', keywords: ['real estate', 'property', 'listing', 'agent'] },
  'ai-content-generation': { title: 'AI Content Generation', description: 'AI-powered content creation, drafting, summarization, and publishing workflows.', keywords: ['ai', 'openai', 'content', 'generate', 'draft', 'summarize'] },
  'invoice-processing': { title: 'Invoice Processing Automation', description: 'Extract, validate, and route invoice data for accounting and finance teams.', keywords: ['invoice', 'payment', 'billing', 'accounting'] },
  'social-media': { title: 'Social Media Automation', description: 'Post scheduling, engagement monitoring, and cross-platform content distribution.', keywords: ['social', 'media', 'post', 'schedule', 'twitter'] },
  'customer-support': { title: 'Customer Support Automation', description: 'Ticket routing, response templates, and satisfaction tracking workflows.', keywords: ['support', 'ticket', 'customer', 'help'] },
  'devops-monitoring': { title: 'DevOps Monitoring', description: 'CI/CD notifications, uptime monitoring, and infrastructure alert workflows.', keywords: ['devops', 'deploy', 'monitor', 'ci', 'cd', 'uptime'] },
  'ecommerce': { title: 'E-commerce Automation', description: 'Order processing, inventory alerts, and storefront management workflows.', keywords: ['shopify', 'woocommerce', 'order', 'inventory', 'ecommerce'] },
};

export default function UseCasePage() {
  const { slug } = useParams<{ slug: string }>();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const config = slug ? useCaseDefinitions[slug] : null;

  useEffect(() => {
    setLoading(true);
    workflowRepository.getWorkflows({}, 1, 1000)
      .then(res => {
        if (config) {
          const filtered = res.workflows.filter(w => {
            const text = `${w.name} ${w.description} ${w.integrations.join(' ')}`.toLowerCase();
            return config.keywords.some(kw => text.includes(kw.toLowerCase()));
          });
          setWorkflows(filtered);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug, config]);

  if (!slug || !config) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Tag className="h-7 w-7 text-violet-500" />
            <span>Use Case Directories</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Explore specialized workflow indices mapped to specific business processes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(useCaseDefinitions).map(([key, def]) => (
            <Link
              key={key}
              to={`/use-case/${key}`}
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 hover:border-violet-300 dark:hover:border-zinc-700 transition-all space-y-2"
            >
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">{def.title}</h2>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">{def.description}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading use case workflows...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/use-case" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-500 transition-colors mb-4">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Use Cases</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">{config.title}</h1>
        <p className="text-zinc-550 dark:text-zinc-400 text-sm mt-1">{config.description}</p>
        <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-2">{workflows.length} matching workflows found.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {workflows.map(w => (
          <WorkflowCard key={w.id} workflow={w} />
        ))}
      </div>
    </div>
  );
}
