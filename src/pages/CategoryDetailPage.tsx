import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Folder } from 'lucide-react';
import { workflowRepository } from '../repositories';
import { Workflow } from '../types/workflow';
import WorkflowCard from '../components/workflow/WorkflowCard';

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    const formattedTitle = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');
    setTitle(formattedTitle);

    workflowRepository.getWorkflows({ category: slug }, 1, 100)
      .then(res => {
        setWorkflows(res.workflows);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading workflows...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/categories" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-violet-500 transition-colors">
          <ArrowLeft className="h-3 w-3" />
          <span>Back to Categories</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850">
          <Folder className="h-6 w-6 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">{title}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Found {workflows.length} workflows in this category.</p>
        </div>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">No workflows found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflows.map(w => (
            <WorkflowCard key={w.id} workflow={w} />
          ))}
        </div>
      )}
    </div>
  );
}
