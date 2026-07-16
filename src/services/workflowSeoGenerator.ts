import { Workflow } from '../types/workflow';

interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  canonicalSlug: string;
  searchIntent: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
}

export function generateWorkflowSeo(workflow: Workflow): SeoMetadata {
  const cleanName = workflow.name.replace(/[^a-zA-Z0-9\s]+/g, '').trim();
  const primaryKeyword = `${cleanName} n8n workflow`;
  
  const metaTitle = `${cleanName} n8n Workflow Template | FlowMatch AI`;
  const metaDescription = `Automate ${cleanName} with n8n. Find prebuilt setups using ${workflow.integrations.join(', ')}. Scanned safe, quality verified blueprint.`;

  const canonicalSlug = `/workflow/${workflow.slug}`;
  const searchIntent = `Find prebuilt n8n automation blueprints for ${workflow.integrations.slice(0, 2).join(' and ')}.`;

  const secondaryKeywords = [
    'n8n workflow template',
    'n8n automation template',
    ...workflow.integrations.map(i => `${i.toLowerCase()} n8n integration`),
    workflow.difficulty.toLowerCase()
  ];

  return {
    metaTitle,
    metaDescription,
    canonicalSlug,
    searchIntent,
    primaryKeyword,
    secondaryKeywords,
  };
}
