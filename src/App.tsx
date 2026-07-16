import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/LandingPage';
import WorkflowsPage from './pages/WorkflowsPage';
import { Loader2 } from 'lucide-react';

// Lazy loaded page components
const WorkflowDetailsPage = lazy(() => import('./pages/WorkflowDetailsPage'));
const AIMatchPage = lazy(() => import('./pages/AIMatchPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));
const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'));
const IntegrationDetailPage = lazy(() => import('./pages/IntegrationDetailPage'));
const SourcesPage = lazy(() => import('./pages/SourcesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AdminImportPage = lazy(() => import('./pages/AdminImportPage'));
const AdminGeneratePage = lazy(() => import('./pages/AdminGeneratePage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const UseCasePage = lazy(() => import('./pages/UseCasePage'));
const AlternativesPage = lazy(() => import('./pages/AlternativesPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
      <p className="text-zinc-400 dark:text-zinc-500 text-sm">Loading page assets...</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Main Directory & Core Features */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/workflow/:slug" element={<WorkflowDetailsPage />} />
            <Route path="/ai-match" element={<AIMatchPage />} />
            
            {/* Directory Categorizations */}
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:slug" element={<CategoryDetailPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/integration/:slug" element={<IntegrationDetailPage />} />

            {/* Collections & Use Cases */}
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/use-case" element={<UseCasePage />} />
            <Route path="/use-case/:slug" element={<UseCasePage />} />

            {/* Sources and Attributions */}
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/alternatives" element={<AlternativesPage />} />

            {/* Legal Policies */}
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/workflow-removal" element={<LegalPage />} />
            <Route path="/copyright-policy" element={<LegalPage />} />

            {/* Admin Tools */}
            <Route path="/admin/import" element={<AdminImportPage />} />
            <Route path="/admin/generate" element={<AdminGeneratePage />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
