import { Shield, Cpu, Code, Layers, Sparkles, DollarSign } from 'lucide-react';

interface Alternative {
  name: string;
  tagline: string;
  description: string;
  bestFor: string;
  icon: any;
  mappingGuide: string;
  badge: string;
}

export default function AlternativesPage() {
  const alternatives: Alternative[] = [
    {
      name: 'Vellum',
      tagline: 'The open-source personal AI assistant',
      description: 'Where workflow builders give you a canvas, Vellum gives you an assistant with memory across Mac, iOS, web app, voice, email, Telegram, and Slack.',
      bestFor: 'Individuals who want compounding productivity gains without designing workflows.',
      icon: Sparkles,
      badge: 'AI Assistant',
      mappingGuide: 'Feed the detailed FlowMatch "About this workflow" and "Configuration Steps" markdown directly into Vellum\'s system prompt settings to equip your assistant with the execution path.'
    },
    {
      name: 'Make',
      tagline: 'Visual scenario builder with deep branching',
      description: 'A highly visual scenario builder featuring advanced routing, data filters, iterators, and comprehensive array/JSON manipulation features.',
      bestFor: 'Power users coming from n8n who want a fully managed and hosted canvas UI.',
      icon: Layers,
      badge: 'Visual Canvas',
      mappingGuide: 'Map n8n nodes to Make modules. Triggers align to Make webhooks, Set/Function nodes align to Make tools, and HTTP nodes map to HTTP Make requests.'
    },
    {
      name: 'Pipedream',
      tagline: 'Developer-first serverless workflow engine',
      description: 'An execution platform optimized for code-level control, featuring serverless steps written in JavaScript, Node.js, Python, and Go.',
      bestFor: 'Engineers and developers who prefer writing structured code over visual dragging.',
      icon: Code,
      badge: 'Code-First',
      mappingGuide: 'Extract JavaScript/Python logic blocks directly from n8n Function nodes and paste them directly into Pipedream serverless code steps.'
    },
    {
      name: 'Zapier',
      tagline: 'Industry-leading linear connector catalog',
      description: 'An incredibly simple linear sequence builder offering the widest variety of pre-integrated software products in the SaaS market.',
      bestFor: 'Non-technical business teams looking to quickly connect SaaS apps without complex logic.',
      icon: Cpu,
      badge: 'Simple Linear',
      mappingGuide: 'Recreate n8n trigger and action pathways using Zapier\'s linear steps, mapping inputs and output parameters sequentially.'
    },
    {
      name: 'Pabbly Connect',
      tagline: 'Flat-rate pricing with generous task limits',
      description: 'An affordable Zapier-style canvas featuring flat subscription pricing plans and zero charging fees on internal workflow task runs.',
      bestFor: 'Small businesses and agencies watching unit costs and looking to scale volume.',
      icon: DollarSign,
      badge: 'Cost-Efficient',
      mappingGuide: 'Follow the linear integration steps in FlowMatch instructions and recreate the connection maps inside Pabbly\'s canvas designer.'
    },
    {
      name: 'Stack AI',
      tagline: 'AI-native workflow builder and agent engine',
      description: 'An enterprise-grade workflow designer built from the ground up for LLMs, vector storage, custom agents, and security compliance.',
      bestFor: 'Teams building LLM-integrated automation pipelines requiring enterprise governance.',
      icon: Shield,
      badge: 'AI-Native / Enterprise',
      mappingGuide: 'Rebuild n8n AI chains (LangChain nodes) inside Stack AI using their native vector database, prompt blocks, and API endpoints.'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header section */}
      <div className="space-y-4 max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Product Shortlist</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Top 6 n8n Alternatives Shortlist
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
          Workflow builders give you primitives and ask you to assemble the agent. A personal AI assistant ships the agent already running. Here are the six picks that earned our shortlist, detailing how to adapt FlowMatch blueprints to each platform.
        </p>
      </div>

      {/* Alternatives grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alternatives.map((alt) => {
          const Icon = alt.icon;
          return (
            <div key={alt.name} className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 shadow-sm dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-lg">{alt.name}</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">{alt.tagline}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-500/20 px-2 py-0.5 rounded">
                  {alt.badge}
                </span>
              </div>

              <div className="mt-4 flex-1 space-y-3">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {alt.description}
                </p>
                <div className="text-xs">
                  <span className="text-zinc-400 block font-semibold">Best For:</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{alt.bestFor}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 p-3 rounded-lg border border-zinc-200/40 dark:border-zinc-800/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 block mb-1">
                  How to Adapt Blueprints
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {alt.mappingGuide}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
