import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-6">
      <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto animate-pulse" />
      
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">An Error Occurred</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
          FlowMatch encountered an unexpected issue while loading this page. Our team has been notified.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-violet-500 hover:to-indigo-500 transition-all"
      >
        <RotateCcw className="h-4.5 w-4.5" />
        <span>Reload Page</span>
      </button>
    </div>
  );
}
