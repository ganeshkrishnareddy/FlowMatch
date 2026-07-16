// Map of integration names to Lucide icons or class names
export function getIntegrationIconUrl(name: string): string {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Return standard icon URLs or dynamic SVGs
  // If not found, returns a generic fallback icon path
  return `/icons/integrations/${norm}.svg`;
}

export function normalizeIntegrationName(name: string): string {
  const lower = name.toLowerCase().trim().replace(/\s+/g, ' ');
  
  if (lower === 'googlesheets' || lower === 'google sheets' || lower === 'spreadsheet') {
    return 'Google Sheets';
  }
  if (lower === 'gmail' || lower === 'email' || lower === 'mail') {
    return 'Gmail';
  }
  if (lower === 'slack' || lower === 'slackbot') {
    return 'Slack';
  }
  if (lower === 'discord' || lower === 'discordbot') {
    return 'Discord';
  }
  if (lower === 'telegram' || lower === 'telegrambot') {
    return 'Telegram';
  }
  if (lower === 'notion' || lower === 'notionapp') {
    return 'Notion';
  }
  if (lower === 'airtable') {
    return 'Airtable';
  }
  if (lower === 'github') {
    return 'GitHub';
  }
  if (lower === 'gitlab') {
    return 'GitLab';
  }
  if (lower === 'openai' || lower === 'ai' || lower === 'gpt') {
    return 'OpenAI';
  }
  if (lower === 'shopify') {
    return 'Shopify';
  }
  if (lower === 'woocommerce' || lower === 'woo') {
    return 'WooCommerce';
  }
  if (lower === 'stripe') {
    return 'Stripe';
  }
  if (lower === 'wordpress' || lower === 'wp') {
    return 'WordPress';
  }
  if (lower === 'hubspot') {
    return 'HubSpot';
  }
  
  // Title-case default
  return name.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
