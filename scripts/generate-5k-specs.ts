import * as fs from 'fs';
import * as path from 'path';

function generateRandomString(length: number) {
  return Math.random().toString(36).substring(2, length + 2);
}

function createSpec(
  title: string, 
  businessProblem: string, 
  triggerIntegration: string, 
  requiredIntegrations: string[], 
  expectedOutput: string, 
  testScenario: string, 
  customizationIdeas: string[],
  workflowSteps: string[],
  architecturePattern: string,
  category: string
) {
  return {
    id: `spec-gen-${generateRandomString(8)}`,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    triggerType: ['Webhook', 'Scheduled', 'Manual'].includes(triggerIntegration) ? triggerIntegration : 'Webhook',
    title,
    businessProblem,
    triggerIntegration,
    requiredIntegrations,
    expectedOutput,
    testScenario,
    customizationIdeas,
    workflowSteps,
    architecturePattern,
    category,
    subcategory: 'General',
    businessIndustry: 'Various',
    targetUsers: 'Operations Teams',
    difficulty: 'Intermediate',
    estimatedSetupTime: '15 Mins',
    keywords: requiredIntegrations,
    securityConsiderations: 'Secure webhook endpoints.'
  };
}

const specs = [];

function getRand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const domains = [
  'Agriculture Automation', 'Automotive Business', 'Construction', 'Property Management', 
  'Insurance Operations', 'Legal Operations', 'Healthcare Administration', 'Dental Clinics', 
  'Pharmacies', 'Fitness Centers', 'Beauty Salons', 'Event Management', 'Photography Businesses', 
  'Videography Agencies', 'YouTube Creators', 'Podcast Creators', 'Newsletter Businesses', 
  'NGOs', 'Schools', 'Universities', 'Coaching Centers', 'Job Portals', 'Recruitment Agencies', 
  'Cybersecurity Teams', 'IT Helpdesk', 'Managed Service Providers', 'SaaS Companies', 
  'Web Development Agencies', 'SEO Agencies', 'Hotels', 'Travel Agencies', 'Restaurants', 
  'Food Delivery Operations', 'Retail Stores', 'Supermarkets', 'Amazon Sellers', 'Manufacturing', 
  'Warehouses', 'Logistics', 'Fleet Management', 'Accounting Firms', 'Consultants'
];
const triggers = ['Webhook', 'Scheduled', 'Manual'];

const verbs = ['Send', 'Sync', 'Export', 'Extract', 'Route', 'Process', 'Summarize', 'Qualify', 'Analyze', 'Generate', 'Review', 'Archive', 'Audit', 'Update', 'Monitor', 'Triage'];
const nouns = ['Leads', 'Invoices', 'Alerts', 'Orders', 'Reports', 'Messages', 'Registrations', 'Feedback', 'Events', 'Metrics', 'Logs', 'Documents', 'Tasks', 'Issues', 'Contacts', 'Profiles'];
const adjectives = ['New', 'Critical', 'High-Value', 'Weekly', 'Daily', 'Urgent', 'Stale', 'Failed', 'Successful', 'Pending', 'Verified', 'Flagged'];
const apps = ['Slack', 'Discord', 'Telegram', 'Gmail', 'Google Sheets', 'Airtable', 'Notion', 'HubSpot', 'Stripe', 'Shopify', 'WooCommerce', 'WordPress', 'GitHub', 'Jira', 'Zendesk', 'Trello', 'Asana'];
const problems = [
  'Manual data entry is prone to human error and delays.',
  'Teams lack visibility into critical updates.',
  'Response times are too slow, causing customer churn.',
  'Information is siloed across multiple unconnected platforms.',
  'Staff waste hours on repetitive administrative tasks.',
  'Important notifications are missed in crowded inboxes.',
  'Scaling operations requires automated handoffs between departments.',
  'Lack of automated reporting hinders decision making.',
  'Security risks arise when alerts are not triaged immediately.',
  'Inconsistent formatting causes downstream processing failures.'
];
const steps1 = ['Listen for Webhook', 'Fetch Latest Records', 'Run Scheduled Trigger', 'Poll API Endpoint', 'Monitor Event Stream'];
const steps2 = ['Parse JSON Payload', 'Filter Irrelevant Data', 'Transform Schema', 'Enrich with External API', 'Cleanse Text Content'];
const steps3 = ['Create Destination Record', 'Send Notification Alert', 'Update Existing Row', 'Trigger Sub-workflow', 'Log Transaction'];
const architectures = ['Webhook to Messaging', 'Scheduled Sync', 'ETL Pipeline', 'Alert Router', 'Data Enrichment', 'State Synchronization'];
const categories = ['Operations', 'Marketing', 'Sales', 'Support', 'Finance', 'Engineering', 'HR', 'Product', 'Security', 'IT'];

for (let i = 0; i < 2000; i++) {
  const v = getRand(verbs);
  const adj = getRand(adjectives);
  const n = getRand(nouns);
  const a1 = getRand(apps);
  const a2 = getRand(apps.filter(x => x !== a1));
  const a3 = getRand(apps.filter(x => x !== a1 && x !== a2));
  
  const domain = getRand(domains);
  
  const title = `${v} ${adj} ${domain} ${n} from ${a1} to ${a2}`;
  const prob = `In ${domain}, ${getRand(problems)} Focusing on ${n.toLowerCase()} helps.`;
  const trig = getRand(triggers);
  const req = [a1, a2, Math.random() > 0.5 ? a3 : null].filter(Boolean) as string[];
  const out = `${adj} ${n} are successfully processed and available in ${a2}.`;
  const test = `Send a mock ${n.toLowerCase()} payload to verify end-to-end delivery.`;
  const cust = [`Add ${a3} for additional logging.`, `Filter out non-${adj.toLowerCase()} items.`];
  
  const wSteps = [getRand(steps1), getRand(steps2), getRand(steps3)];
  const arch = getRand(architectures);
  const cat = getRand(categories);

  specs.push(createSpec(title, prob, trig, req, out, test, cust, wSteps, arch, cat));
}

const specsPath = path.join(process.cwd(), 'src', 'data', 'workflow-generation', 'specs.json');
fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2));

console.log(`✅ Generated ${specs.length} new workflow specifications.`);
