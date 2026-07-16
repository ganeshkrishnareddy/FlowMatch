const DISPLAY_ALIASES: Record<string, string> = {
  'acuitySchedulingTrigger': 'Acuity Scheduling',
  'activeCampaign': 'ActiveCampaign',
  'affinity': 'Affinity',
  'lmChatOpenAi': 'OpenAI Chat Model',
  'httpRequest': 'HTTP Request',
  'googleSheets': 'Google Sheets',
  'googleDrive': 'Google Drive',
  'telegramTrigger': 'Telegram',
  'gmailTrigger': 'Gmail',
  'wooCommerce': 'WooCommerce',
  'microsoftOutlook': 'Microsoft Outlook',
  'postgres': 'PostgreSQL',
  'mySql': 'MySQL',
  'mongoDb': 'MongoDB',
  'stickyNote': 'Sticky Note',
  'webhook': 'Webhook',
  'cron': 'Scheduled Trigger',
  'manualTrigger': 'Manual Trigger',
  'openAi': 'OpenAI',
  'github': 'GitHub',
  'slack': 'Slack',
  'discord': 'Discord',
  'notion': 'Notion',
  'airtable': 'Airtable',
  'hubspot': 'HubSpot',
  'shopify': 'Shopify',
  'wordpress': 'WordPress',
  'supabase': 'Supabase',
};

export function getCleanNodeName(nodeType: string): string {
  if (DISPLAY_ALIASES[nodeType]) {
    return DISPLAY_ALIASES[nodeType];
  }

  // Remove n8n prefix if present
  let clean = nodeType.replace(/^(n8n-nodes-base\.|@n8n\/)/i, '');

  // Strip versions
  clean = clean.replace(/v\d+$/i, '');

  // Strip common suffixes
  clean = clean.replace(/(Trigger|Tool|Node|Helper)$/i, '');

  // Split camelCase/PascalCase
  clean = clean.replace(/([A-Z])/g, ' $1').trim();

  // Title case words
  return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}
