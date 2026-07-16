import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, Archive, ArrowRight } from 'lucide-react';
import { Workflow } from '../../types/workflow';
import DifficultyBadge from './DifficultyBadge';
import OriginBadge from './OriginBadge';

interface WorkflowCardProps {
  workflow: Workflow;
}

export default function WorkflowCard({ workflow }: WorkflowCardProps) {
  return (
    <div className="group p-5 rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 hover:border-violet-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-none transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Top Metadata Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <DifficultyBadge difficulty={workflow.difficulty} />
            <OriginBadge origin={workflow.workflowOrigin} />
            {workflow.verified && (
              <span className="flex items-center gap-0.5 text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified</span>
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
            {workflow.estimatedSetupTime}
          </span>
        </div>

        {/* Title and Description */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {workflow.display_title || workflow.name}
          </h3>
          <p className="text-xs text-slate-650 dark:text-zinc-400 line-clamp-3 leading-relaxed">
            {workflow.display_description || workflow.description}
          </p>
        </div>
      </div>

      {/* Footer / Integrations and Action */}
      <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-3.5 mt-5 flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1">
          {workflow.integrations.slice(0, 3).map((integration, idx) => (
            <span 
              key={idx} 
              className="text-[9px] bg-slate-50 dark:bg-zinc-900 text-slate-650 dark:text-zinc-350 px-2.5 py-0.5 rounded font-medium border border-slate-200/60 dark:border-zinc-800/60"
            >
              {integration}
            </span>
          ))}
          {workflow.integrations.length > 3 && (
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium self-center pl-0.5">
              +{workflow.integrations.length - 3}
            </span>
          )}
        </div>
        
        <Link
          to={`/workflow/${workflow.slug}`}
          className="text-xs font-semibold text-violet-750 dark:text-white bg-violet-50/50 dark:bg-zinc-900 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 px-3.5 py-1.5 rounded-lg border border-violet-200/50 dark:border-zinc-850 transition-all shadow-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
