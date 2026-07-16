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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <FlowMatchLogo size={24} showWordmark />
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400 dark:text-zinc-500 max-w-xs">
              Search thousands of ready-to-use automation workflows.
            </p>
            <div className="pt-2">
              <a href="https://www.producthunt.com/products/flowmatch?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-flowmatch" target="_blank" rel="noopener noreferrer">
                <img alt="FlowMatch - The open-source search engine for automation workflows | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1198182&amp;theme=dark&amp;t=1784208081526" className="h-10 w-auto" />
              </a>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-600 space-y-1.5 mt-2">
              <div>
                <Link to="/workflows" className="hover:text-zinc-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span>📊</span> Workflows: <span className="text-zinc-600 dark:text-zinc-400 font-semibold">{stats.totalWorkflows.toLocaleString()}</span>
                </Link>
              </div>
              <div>
                <Link to="/integrations" className="hover:text-zinc-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span>🔌</span> Integrations: <span className="text-zinc-600 dark:text-zinc-400 font-semibold">{stats.integrationsCount}</span>
                </Link>
              </div>
              <div>
                <Link to="/categories" className="hover:text-zinc-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span>📁</span> Categories: <span className="text-zinc-600 dark:text-zinc-400 font-semibold">{stats.categoriesCount}</span>
                </Link>
              </div>
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
              <li><a href="mailto:hello@flowmatch.tech" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-zinc-400 dark:text-zinc-650 max-w-2xl text-center md:text-left leading-relaxed">
            Built and maintained by <Link to="/about" className="text-violet-650 dark:text-violet-400 font-semibold hover:underline">ProgVision</Link>.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/ganeshkrishnareddy/FlowMatch" target="_blank" rel="noopener noreferrer" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <span className="font-medium">GitHub</span>
            </a>
            <p className="text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
              &copy; {new Date().getFullYear()} FlowMatch. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
