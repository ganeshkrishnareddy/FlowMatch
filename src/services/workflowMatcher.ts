import { Workflow, WorkflowMatch, WorkflowMatchScore } from '../types/workflow';

// Keyword to integration mapping helper
const keywordToIntegration: Record<string, string> = {
  "sheet": "Google Sheets",
  "spreadsheet": "Google Sheets",
  "email": "Gmail",
  "gmail": "Gmail",
  "mail": "Gmail",
  "slack": "Slack",
  "telegram": "Telegram",
  "discord": "Discord",
  "whatsapp": "WhatsApp",
  "openai": "OpenAI",
  "ai": "OpenAI",
  "llm": "OpenAI",
  "gpt": "OpenAI",
  "github": "GitHub",
  "wordpress": "WordPress",
  "shopify": "Shopify",
  "stripe": "Stripe",
  "notion": "Notion",
  "airtable": "Airtable",
  "hubspot": "HubSpot",
  "crm": "HubSpot",
};

export function extractIntent(query: string): {
  integrations: string[];
  triggerType: string;
  keywords: string[];
} {
  const q = query.toLowerCase();
  const detectedIntegrations: string[] = [];
  const keywords = q.split(/\s+/).filter(w => w.length > 3);

  // Check integration keywords
  for (const [kw, integration] of Object.entries(keywordToIntegration)) {
    if (q.includes(kw)) {
      detectedIntegrations.push(integration);
    }
  }

  // Detect Trigger type intent
  let triggerType = 'Manual';
  if (q.includes('schedule') || q.includes('every') || q.includes('cron') || q.includes('daily') || q.includes('hourly')) {
    triggerType = 'Scheduled';
  } else if (q.includes('webhook') || q.includes('trigger') || q.includes('alert') || q.includes('incoming') || q.includes('receive') || q.includes('when')) {
    triggerType = 'Webhook';
  }

  return {
    integrations: Array.from(new Set(detectedIntegrations)),
    triggerType,
    keywords,
  };
}

export function matchWorkflowLocal(
  query: string,
  workflow: Workflow
): WorkflowMatch | null {
  const intent = extractIntent(query);
  const wName = workflow.name.toLowerCase();
  const wDesc = workflow.description.toLowerCase();

  // 1. Integration match (40%)
  let integrationScore = 0;
  if (intent.integrations.length > 0) {
    const matched = intent.integrations.filter(i => workflow.integrations.includes(i));
    integrationScore = (matched.length / intent.integrations.length) * 40;
  } else {
    // If no specific integrations asked, give baseline default
    integrationScore = 20;
  }

  // 2. Keyword similarity (25%)
  let keywordScore = 0;
  if (intent.keywords.length > 0) {
    let matches = 0;
    for (const kw of intent.keywords) {
      if (wName.includes(kw) || wDesc.includes(kw)) {
        matches++;
      }
    }
    keywordScore = (matches / intent.keywords.length) * 25;
  }

  // 3. Category match (15%)
  // Simple check: if category slug matches query words
  let categoryScore = 0;
  if (workflow.category) {
    const catSlug = workflow.category.slug.toLowerCase().replace('-', ' ');
    if (query.toLowerCase().includes(catSlug)) {
      categoryScore = 15;
    } else {
      categoryScore = 5;
    }
  }

  // 4. Trigger match (10%)
  // Check if primary trigger type corresponds to user description trigger intent
  const triggerScore = workflow.description.toLowerCase().includes(intent.triggerType.toLowerCase()) ? 10 : 5;

  // 5. Complexity match (10%)
  // Baseline complexity points
  const complexityScore = workflow.difficulty === 'Intermediate' ? 10 : 7;

  const total = Math.round(integrationScore + keywordScore + categoryScore + triggerScore + complexityScore);

  // Filter out completely unrelated search results (must have at least a baseline score)
  if (total < 35) return null;

  const scoreBreakdown: WorkflowMatchScore = {
    total,
    integrationScore: Math.round(integrationScore),
    keywordScore: Math.round(keywordScore),
    categoryScore: Math.round(categoryScore),
    triggerScore: Math.round(triggerScore),
    complexityScore: Math.round(complexityScore),
  };

  // Compile Match Reason
  let matchReason = `Matches your automation prompt.`;
  if (intent.integrations.length > 0) {
    const common = intent.integrations.filter(i => workflow.integrations.includes(i));
    if (common.length > 0) {
      matchReason = `This workflow matches your request because it utilizes ${common.join(' and ')} to orchestrate actions.`;
    }
  }

  return {
    workflow,
    matchScore: scoreBreakdown,
    matchReason,
  };
}

export function rankMatchingWorkflows(
  query: string,
  workflows: Workflow[]
): WorkflowMatch[] {
  const matches: WorkflowMatch[] = [];
  for (const w of workflows) {
    const m = matchWorkflowLocal(query, w);
    if (m) matches.push(m);
  }
  return matches.sort((a, b) => b.matchScore.total - a.matchScore.total);
}
