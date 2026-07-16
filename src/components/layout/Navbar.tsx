import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import FlowMatchLogo from '../brand/FlowMatchLogo';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/workflows?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <FlowMatchLogo size={28} showWordmark />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <Link to="/workflows" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Discover</Link>
              <Link to="/ai-match" className="hover:text-zinc-900 dark:hover:text-white transition-colors">AI Match</Link>
              <Link to="/categories" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Categories</Link>
              <Link to="/integrations" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Integrations</Link>
              <Link to="/collections" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Collections</Link>
              <a href="https://razorpay.me/@ProgVision" target="_blank" rel="noopener noreferrer" className="text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 font-semibold px-2.5 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">Support ☕</a>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3.5">
            <form onSubmit={handleQuickSearch} className="relative w-[270px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search 5,000+ workflows..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full h-[42px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 pl-11 pr-4 text-sm text-zinc-850 dark:text-zinc-200 placeholder:text-zinc-450 dark:placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 shadow-sm"
              />
            </form>
            <a
              href="https://github.com/ganeshkrishnareddy/FlowMatch"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-55 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm"
              aria-label="GitHub repository"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-55 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 inline-flex items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-1 transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 absolute pointer-events-none -translate-y-4'}`}
      >
        <Link to="/workflows" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-3 text-base font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors">Discover</Link>
        <Link to="/ai-match" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-3 text-base font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors">AI Match</Link>
        <Link to="/categories" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-3 text-base font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors">Categories</Link>
        <Link to="/integrations" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-3 text-base font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors">Integrations</Link>
        <Link to="/collections" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-3 text-base font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors">Collections</Link>
        <a href="https://razorpay.me/@ProgVision" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center mt-2 bg-zinc-50 dark:bg-zinc-900/40 transition-colors">Support ☕</a>
      </div>
    </nav>
  );
}
