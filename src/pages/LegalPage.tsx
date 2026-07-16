import { useLocation } from 'react-router-dom';
import { Shield, FileText, Trash2, Scale } from 'lucide-react';

export default function LegalPage() {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Document Not Found';
  let description = 'The requested legal page could not be located.';
  let icon = FileText;
  let content = <p>No legal text loaded.</p>;

  if (path === '/privacy') {
    title = 'Privacy Policy';
    description = 'Last updated: July 16, 2026. How we manage and respect your data privacy.';
    icon = Shield;
    content = (
      <div className="space-y-6 text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">1. Data Ingestion & Collection</h2>
          <p>
            FlowMatch is a directory index platform designed to search public automation templates. We do not harvest, track, or sell your personal data.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">2. Search Analytics</h2>
          <p>
            Natural language and AI workflow matching queries are processed strictly on the client-side or sent anonymously to local vector fallback models. Your query terms are never logged or tied back to your physical identity.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">3. Third-Party Links</h2>
          <p>
            Our templates reference and connect to external developer platforms and cloud tools. We encourage users to inspect the individual privacy terms of third-party integration nodes they authorize.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">4. Cookies</h2>
          <p>
            We use local storage strictly to save your visual user preferences (such as Light/Dark mode state). No marketing or tracking cookies are utilized.
          </p>
        </section>
      </div>
    );
  } else if (path === '/terms') {
    title = 'Terms of Service';
    description = 'Last updated: July 16, 2026. Rules and terms governing the use of FlowMatch.';
    icon = Scale;
    content = (
      <div className="space-y-6 text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and utilizing the FlowMatch search directory, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">2. Directory Disclaimer</h2>
          <p>
            FlowMatch serves as an educational repository. Workflow blueprints are provided "as is" under their respective open-source licensing. We do not guarantee the validity, security, or execution compatibility of downloaded JSON templates.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">3. Liability Limits</h2>
          <p>
            Under no circumstances shall FlowMatch or its maintainers (ProgVision) be liable for system downtime, data loss, API costs, or security compromises caused by importing or running these workflows on your target instances.
          </p>
        </section>
      </div>
    );
  } else if (path === '/workflow-removal') {
    title = 'Workflow Removal Guide';
    description = 'Are you a creator? Here is how to request template removal.';
    icon = Trash2;
    content = (
      <div className="space-y-6 text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Request Removal Process</h2>
          <p>
            If you are the original author of an indexed workflow and wish to have it removed from our directory database, please create a ticket or get in touch. We respect developer provenance and take down requested templates promptly.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">What to Provide</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Link to the specific workflow page on FlowMatch.</li>
            <li>Verification or link establishing ownership of the original repository.</li>
            <li>Brief description of the request.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Contact Maintainers</h2>
          <p>
            Please open an issue directly on our GitHub repository or contact us via developer channels to submit a request.
          </p>
        </section>
      </div>
    );
  } else if (path === '/copyright-policy') {
    title = 'Copyright Policy (DMCA)';
    description = 'Standard copyright compliance notice and takedown guidelines.';
    icon = FileText;
    content = (
      <div className="space-y-6 text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Takedown Notice Compliance</h2>
          <p>
            FlowMatch respects intellectual property rights. If you believe your copyrighted materials have been indexed on the platform in a way that constitutes infringement, please submit a formal DMCA notification to our maintainer channels.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">DMCA Requirements</h2>
          <p>
            Your notice must contain: physical/electronic signature, identification of the copyrighted work, URL paths on FlowMatch, your contact details, and a statement made under penalty of perjury confirming your good-faith belief of infringement.
          </p>
        </section>
      </div>
    );
  }

  const Icon = icon;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
          <Icon className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{title}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{description}</p>
      </div>
      <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 shadow-sm dark:shadow-none">
        {content}
      </div>
    </div>
  );
}
