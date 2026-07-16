import { DifficultyType } from '../../types/workflow';

interface DifficultyBadgeProps {
  difficulty: DifficultyType;
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const diff = difficulty.toLowerCase();
  
  if (diff === 'beginner') {
    return (
      <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-250 dark:border-emerald-500/20">
        Beginner
      </span>
    );
  }
  if (diff === 'intermediate') {
    return (
      <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-250 dark:border-amber-500/20">
        Intermediate
      </span>
    );
  }
  return (
    <span className="text-[10px] font-extrabold uppercase text-rose-700 dark:text-rose-450 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-250 dark:border-rose-500/20">
      Advanced
    </span>
  );
}
