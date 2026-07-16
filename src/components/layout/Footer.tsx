import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FlowMatchLogo from '../brand/FlowMatchLogo';
import { workflowRepository } from '../../repositories';

export default function Footer() {
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    integrationsCount: 0,
    categoriesCount: 0,
  });

  useEffect(() => {
    workflowRepository.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <FlowMatchLogo size={22} showWordmark />
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
              Search thousands of ready-to-use n8n automation workflows and find the right template for your process.
            </p>
            <div className="text-xs text-zinc-400 dark:text-zinc-600 space-y-1">
              <div>📊 Workflows: <span className="text-zinc-600 dark:text-zinc-400 font-semibold">{stats.totalWorkflows.toLocaleString()}</span></div>
              <div>🔌 Integrations: <span className="text-zinc-600 dark:text-zinc-400 font-semibold">{stats.integrationsCount}</span></div>
              <div>📁 Categories: <span className="text-zinc-600 dark:text-zinc-400 font-semibold">{stats.categoriesCount}</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/workflows" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Discover Workflows</Link></li>
              <li><Link to="/ai-match" className="hover:text-zinc-900 dark:hover:text-white transition-colors">AI Match</Link></li>
              <li><Link to="/categories" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/integrations" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Integrations</Link></li>
              <li><Link to="/collections" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Our Story & Creator</Link></li>
              <li><Link to="/sources" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Sources & Attribution</Link></li>
              <li><Link to="/alternatives" className="hover:text-zinc-900 dark:hover:text-white transition-colors">n8n Alternatives</Link></li>
              <li><Link to="/workflow-removal" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Workflow Removal</Link></li>
              <li><Link to="/copyright-policy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Copyright Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-zinc-400 dark:text-zinc-600 max-w-2xl text-center md:text-left leading-relaxed">
            FlowMatch indexes automation workflows from permitted public and open-source sources. Developed and maintained by <Link to="/about" className="text-violet-650 dark:text-violet-400 font-semibold hover:underline">ProgVision</Link> (<a href="https://razorpay.me/@ProgVision" target="_blank" rel="noopener noreferrer" className="text-rose-500 font-semibold hover:underline">Support Creator ☕</a>).
          </p>
          <p className="text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
            &copy; {new Date().getFullYear()} FlowMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
