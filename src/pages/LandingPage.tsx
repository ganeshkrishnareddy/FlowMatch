import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, CheckCircle, Shield, Award, Layers, Puzzle, Grid3X3 } from 'lucide-react';
import { workflowRepository } from '../repositories';
import { Workflow } from '../types/workflow';
import WorkflowCard from '../components/workflow/WorkflowCard';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { N8nLogo, MakeLogo, PipedreamLogo, ZapierLogo, PabblyLogo, StackAiLogo, VellumLogo } from '../components/brand/PlatformLogos';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    verifiedWorkflows: 0,
    integrationsCount: 0,
    categoriesCount: 0,
  });
  const [featured, setFeatured] = useState<Workflow[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    workflowRepository.getStats().then(setStats).catch(console.error);
    workflowRepository.getFeaturedWorkflows(6).then(setFeatured).catch(console.error);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ai-match?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChipClick = (text: string) => {
    setQuery(text);
    navigate(`/ai-match?q=${encodeURIComponent(text)}`);
  };

  const chips = [
    'Automate Gmail replies',
    'WhatsApp lead follow-up',
    'AI content automation',
    'Telegram alerts',
    'CRM automation',
    'Invoice processing'
  ];

  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-50 dark:bg-violet-950/20 text-xs font-semibold text-violet-600 dark:text-violet-400">
          <span>Workflow discovery & matching engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
          Find Your Perfect<br />
          <span className="bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Automation Workflow
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
          Describe what you want to automate. FlowMatch searches 5,000+ n8n workflows to find the closest templates for your tools and process.
        </p>

        {/* Natural Language Search Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-4 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Describe what you want to automate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 py-4 pl-12 pr-40 text-base text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 shadow-lg dark:shadow-2xl"
            />
            <button
              type="submit"
              className="absolute right-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center gap-1.5"
            >
              <span>Find My Workflow</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 px-3.5 py-1.5 text-zinc-500 dark:text-zinc-400 hover:border-violet-400 hover:text-violet-600 dark:hover:text-white transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Infinite scrolling compatibility banner */}
      <div className="w-full overflow-hidden relative py-4">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f8fafc] dark:from-[#030303] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f8fafc] dark:from-[#030303] to-transparent z-10 pointer-events-none" />
        
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-semibold mb-6">
          <span>Works with your favorite automation platforms</span>
        </div>

        <div className="flex gap-16 w-max animate-marquee">
          {/* Double list for infinite loop rendering */}
          {[...Array(2)].map((_, listIdx) => (
            <div key={listIdx} className="flex gap-16 items-center pr-16">
              {[
                { name: 'n8n', desc: 'Native JSON', logo: N8nLogo },
                { name: 'Make', desc: 'Scenario', logo: MakeLogo },
                { name: 'Pipedream', desc: 'Serverless', logo: PipedreamLogo },
                { name: 'Zapier', desc: 'Zaps', logo: ZapierLogo },
                { name: 'Pabbly Connect', desc: 'Canvas', logo: PabblyLogo },
                { name: 'Stack AI', desc: 'Agents', logo: StackAiLogo },
                { name: 'Vellum', desc: 'Assistant', logo: VellumLogo }
              ].map((plat, idx) => {
                const Logo = plat.logo;
                return (
                  <div key={idx} className="flex items-center gap-3 whitespace-nowrap opacity-65 hover:opacity-100 transition-opacity">
                    <Logo />
                    <span className="font-extrabold text-sm text-zinc-700 dark:text-zinc-300 tracking-tight">
                      {plat.name}
                    </span>
                    <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-500 font-semibold uppercase tracking-wider">
                      {plat.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Statistics Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-5 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/20 backdrop-blur-sm max-w-5xl mx-auto">
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
            <Layers className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white animate-fade-in">
              <AnimatedCounter value={stats.totalWorkflows} />
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-extrabold">Workflows</div>
          </div>
        </div>
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
            <Puzzle className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white animate-fade-in">
              <AnimatedCounter value={stats.integrationsCount} />
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-extrabold">Integrations</div>
          </div>
        </div>
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Grid3X3 className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white animate-fade-in">
              <AnimatedCounter value={stats.categoriesCount} />
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-extrabold">Categories</div>
          </div>
        </div>
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white animate-fade-in">
              <AnimatedCounter value={stats.verifiedWorkflows} />
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-extrabold">Quality Checked</div>
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Built for Safer, Better Automations</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl mx-auto">Every workflow is automatically checked for quality, duplicates, and common security risks before it appears in FlowMatch.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/10 space-y-3 shadow-sm">
            <Shield className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Security Scanning</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Checks workflow nodes and configuration for exposed secrets, suspicious commands, and common security risks.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/10 space-y-3 shadow-sm">
            <Award className="h-8 w-8 text-violet-500 dark:text-violet-400" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Quality Checks</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Reviews workflow structure, connections, instructions, and configuration completeness.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/10 space-y-3 shadow-sm">
            <CheckCircle className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Duplicate Detection</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Identifies identical and highly similar workflows to keep search results cleaner and more useful.
            </p>
          </div>
        </div>
        <div className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
          ⚠️ Automated checks reduce common risks but do not guarantee a workflow is secure.
        </div>
      </div>

      {/* Featured Workflows Section */}
      {featured.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Popular Automations</h2>
            <Link to="/workflows" className="text-sm font-semibold text-violet-500 hover:text-violet-400 flex items-center gap-1">
              <span>View Directory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((w) => (
              <WorkflowCard key={w.id} workflow={w} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
