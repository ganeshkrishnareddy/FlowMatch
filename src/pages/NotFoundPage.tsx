import { Link } from 'react-router-dom';
import { HelpCircle, Search, Grid3x3, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-6">
      <div className="relative inline-block">
        <HelpCircle className="h-16 w-16 text-violet-500 mx-auto animate-bounce" />
        <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          404
        </span>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Page Not Found</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
          The page or workflow blueprint you are searching for does not exist or has been relocated.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-4">
        <Link 
          to="/workflows" 
          className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition-all"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4 text-violet-500" />
            Search Workflows
          </span>
          <span className="text-xs text-zinc-400">&rarr;</span>
        </Link>
        <Link 
          to="/categories" 
          className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition-all"
        >
          <span className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4 text-violet-500" />
            Browse Categories
          </span>
          <span className="text-xs text-zinc-400">&rarr;</span>
        </Link>
        <Link 
          to="/ai-match" 
          className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition-all"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Try AI Match
          </span>
          <span className="text-xs text-zinc-400">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
