import { Sparkles, Heart, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
          <Sparkles className="h-9 w-9 text-violet-550 animate-pulse" />
          <span>The FlowMatch Story</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Crafting tools that bridge the gap between imagination and execution.
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="h-6 w-6 text-rose-500" />
          <span>Built with Idea and Emotion</span>
        </h2>
        <div className="text-slate-650 dark:text-zinc-300 space-y-4 text-sm leading-relaxed">
          <p>
            At the heart of FlowMatch lies a simple belief: <strong>technology should feel human</strong>. Every line of code, every transition, and every layout is not just compiled logic—it is a translation of ideas and emotions.
          </p>
          <p>
            When we build tools, we don't just solve database entries or optimize payload deliveries. We set out to alleviate the frustration of repetitive work, to ignite the spark of creativity, and to empower individuals to focus on what truly matters. We believe that software is a living canvas where intent meets experience.
          </p>
          <p>
            FlowMatch was born from that exact emotion. The exhaustion of setting up automated pipelines from scratch turned into a passion to index, curate, and author the world’s most comprehensive directory of templates, making high-level workflow orchestration accessible to everyone.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <span>The Creator</span>
          </h3>
          <p className="text-xs text-slate-650 dark:text-zinc-450 leading-relaxed">
            FlowMatch is designed, developed, and maintained by <strong>ProgVision</strong>. Led by passionate builders who care deeply about visual aesthetics, micro-interactions, and code craftsmanship, we create digital products that feel premium and alive.
          </p>
        </div>
        
        <div className="p-6 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span>🚀 Our Vision</span>
          </h3>
          <p className="text-xs text-slate-650 dark:text-zinc-450 leading-relaxed">
            ProgVision strives to make automation secondary nature. By lowering the entry barrier to visual programming through curated templates and AI matching, we enable creators, developers, and operators to execute faster.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl border border-rose-100 dark:border-rose-950/30 bg-rose-50/30 dark:bg-rose-950/5 text-center space-y-4">
        <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">☕ Support the Creator</h3>
        <p className="text-sm text-slate-650 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          If FlowMatch has saved you hours of automation setup or helped you discover new integrations, please consider supporting ProgVision's development.
        </p>
        <div>
          <a
            href="https://razorpay.me/@ProgVision"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-sm transition-all"
          >
            <span>Buy Me a Coffee</span>
            <span>☕</span>
          </a>
        </div>
      </div>
    </div>
  );
}
