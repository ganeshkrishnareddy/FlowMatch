interface OriginBadgeProps {
  origin: 'flowmatch_original' | 'third_party_import';
}

export default function OriginBadge({ origin }: OriginBadgeProps) {
  if (origin === 'flowmatch_original') {
    return (
      <span className="text-[10px] font-extrabold uppercase text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2.5 py-0.5 rounded-full border border-violet-200 dark:border-violet-500/20">
        Original
      </span>
    );
  }
  return (
    <span className="text-[10px] font-extrabold uppercase text-slate-700 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/40 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800/20">
      Indexed
    </span>
  );
}
