const canonicalCategories: Record<string, string> = {
  'ai': 'AI Automation', 'ai automation': 'AI Automation', 'artificial intelligence': 'AI Automation', 'openai': 'AI Automation', 'llm': 'AI Automation', 'machine learning': 'AI Automation',
  'sales': 'Sales', 'sales automation': 'Sales',
  'lead generation': 'Lead Generation', 'lead gen': 'Lead Generation', 'leads': 'Lead Generation',
  'marketing': 'Marketing', 'marketing automation': 'Marketing', 'digital marketing': 'Marketing',
  'social media': 'Social Media', 'social': 'Social Media', 'twitter': 'Social Media', 'facebook': 'Social Media', 'instagram': 'Social Media', 'linkedin': 'Social Media',
  'email automation': 'Email Automation', 'email': 'Email Automation', 'gmail': 'Email Automation', 'mail': 'Email Automation',
  'crm': 'CRM', 'customer relationship': 'CRM', 'hubspot': 'CRM',
  'customer support': 'Customer Support', 'support': 'Customer Support', 'helpdesk': 'Customer Support', 'ticket': 'Customer Support',
  'e-commerce': 'E-commerce', 'ecommerce': 'E-commerce', 'online store': 'E-commerce', 'shopping': 'E-commerce',
  'finance': 'Finance', 'financial': 'Finance', 'payment': 'Finance', 'stripe': 'Finance',
  'accounting': 'Accounting', 'bookkeeping': 'Accounting',
  'hr': 'HR', 'human resources': 'HR', 'people ops': 'HR',
  'recruitment': 'Recruitment', 'hiring': 'Recruitment', 'job': 'Recruitment', 'talent': 'Recruitment',
  'cybersecurity': 'Cybersecurity', 'security': 'Cybersecurity', 'cyber': 'Cybersecurity', 'infosec': 'Cybersecurity',
  'cybersecurity operations': 'Cybersecurity Operations', 'soc': 'Cybersecurity Operations', 'incident': 'Cybersecurity Operations',
  'devops': 'DevOps', 'ci/cd': 'DevOps', 'deployment': 'DevOps', 'infrastructure': 'DevOps',
  'software development': 'Software Development', 'development': 'Software Development', 'coding': 'Software Development',
  'developer productivity': 'Developer Productivity', 'developer': 'Developer Productivity', 'dev tools': 'Developer Productivity',
  'project management': 'Project Management', 'project': 'Project Management', 'task management': 'Project Management',
  'real estate': 'Real Estate', 'property': 'Real Estate', 'realty': 'Real Estate',
  'education': 'Education', 'learning': 'Education', 'teaching': 'Education', 'school': 'Education',
  'student productivity': 'Student Productivity', 'student': 'Student Productivity', 'study': 'Student Productivity',
  'content creation': 'Content Creation', 'content': 'Content Creation', 'blog': 'Content Creation', 'writing': 'Content Creation',
  'seo': 'SEO', 'search engine': 'SEO', 'ranking': 'SEO',
  'wordpress': 'WordPress', 'wp': 'WordPress',
  'shopify': 'Shopify',
  'woocommerce': 'WooCommerce', 'woo': 'WooCommerce',
  'telegram': 'Telegram', 'telegram bot': 'Telegram',
  'whatsapp': 'WhatsApp', 'wa': 'WhatsApp',
  'discord': 'Discord', 'discord bot': 'Discord',
  'slack': 'Slack', 'slack bot': 'Slack',
  'google workspace': 'Google Workspace', 'google': 'Google Workspace', 'google sheets': 'Google Workspace', 'google drive': 'Google Workspace',
  'microsoft 365': 'Microsoft 365', 'microsoft': 'Microsoft 365', 'outlook': 'Microsoft 365', 'teams': 'Microsoft 365',
  'notion': 'Notion',
  'airtable': 'Airtable',
  'data processing': 'Data Processing', 'data': 'Data Processing', 'etl': 'Data Processing',
  'web scraping': 'Web Scraping', 'scraping': 'Web Scraping', 'crawler': 'Web Scraping',
  'reporting': 'Reporting', 'report': 'Reporting',
  'analytics': 'Analytics', 'metrics': 'Analytics', 'dashboard': 'Analytics',
  'notifications': 'Notifications', 'notification': 'Notifications', 'alert': 'Notifications',
  'file management': 'File Management', 'file': 'File Management', 'storage': 'File Management',
  'document processing': 'Document Processing', 'document': 'Document Processing',
  'pdf automation': 'PDF Automation', 'pdf': 'PDF Automation',
  'invoice processing': 'Invoice Processing', 'invoice': 'Invoice Processing', 'billing': 'Invoice Processing',
  'appointment management': 'Appointment Management', 'appointment': 'Appointment Management', 'booking': 'Appointment Management', 'calendar': 'Appointment Management',
  'travel operations': 'Travel Operations', 'travel': 'Travel Operations',
  'hotel operations': 'Hotel Operations', 'hotel': 'Hotel Operations', 'hospitality': 'Hotel Operations',
  'restaurant operations': 'Restaurant Operations', 'restaurant': 'Restaurant Operations', 'food': 'Restaurant Operations',
  'local business automation': 'Local Business Automation', 'local business': 'Local Business Automation',
  'agency automation': 'Agency Automation', 'agency': 'Agency Automation',
  'freelancer automation': 'Freelancer Automation', 'freelancer': 'Freelancer Automation', 'freelance': 'Freelancer Automation',
  'startup automation': 'Startup Automation', 'startup': 'Startup Automation', 'founder': 'Startup Automation',
};

const integrationCategoryHints: Record<string, string> = {
  'Gmail': 'Email Automation', 'Outlook': 'Email Automation',
  'Shopify': 'E-commerce', 'WooCommerce': 'E-commerce', 'Stripe': 'Finance',
  'HubSpot': 'CRM', 'Salesforce': 'CRM',
  'WordPress': 'WordPress', 'Ghost': 'Content Creation',
  'GitHub': 'Software Development', 'GitLab': 'Software Development',
  'Slack': 'Notifications', 'Discord': 'Notifications', 'Telegram': 'Notifications',
  'Google Sheets': 'Data Processing', 'Airtable': 'Data Processing',
  'Notion': 'Project Management', 'Trello': 'Project Management', 'Jira': 'Project Management',
  'OpenAI': 'AI Automation',
};

export function normalizeCategory(
  rawCategory: string | undefined,
  workflowName: string,
  description: string,
  integrations: string[]
): { slug: string; name: string } {
  // 1. Try direct match on raw category
  if (rawCategory) {
    const lower = rawCategory.toLowerCase().trim();
    if (canonicalCategories[lower]) {
      const name = canonicalCategories[lower];
      return { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name };
    }
  }

  // 2. Scan name + description for keyword matches
  const combined = `${workflowName} ${description}`.toLowerCase();
  for (const [keyword, catName] of Object.entries(canonicalCategories)) {
    if (keyword.length >= 3 && combined.includes(keyword)) {
      return { slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: catName };
    }
  }

  // 3. Try integration hints
  for (const integration of integrations) {
    if (integrationCategoryHints[integration]) {
      const name = integrationCategoryHints[integration];
      return { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name };
    }
  }

  // 4. Fallback
  return { slug: 'other-automation', name: 'Other Automation' };
}

export function getAllCanonicalCategories(): string[] {
  return [...new Set(Object.values(canonicalCategories))].sort();
}
