/**
 * MIT License
 * Copyright (c) 2025 Zie619
 * (Portions of integration node mapping logic translated and adapted from Python)
 */

import { WorkflowNode, WorkflowConnection } from '../types/workflow';

// Integration mappings translated from Python source reference
const serviceMappings: Record<string, string> = {
  // Messaging & Communication
  "telegram": "Telegram",
  "telegramtrigger": "Telegram",
  "discord": "Discord",
  "slack": "Slack",
  "whatsapp": "WhatsApp",
  "mattermost": "Mattermost",
  "teams": "Microsoft Teams",
  "rocketchat": "Rocket.Chat",
  // Email
  "gmail": "Gmail",
  "mailjet": "Mailjet",
  "emailreadimap": "Email (IMAP)",
  "emailsendsmt": "Email (SMTP)",
  "outlook": "Outlook",
  // Cloud Storage
  "googledrive": "Google Drive",
  "googledocs": "Google Docs",
  "googlesheets": "Google Sheets",
  "googlesheetstool": "Google Sheets",
  "dropbox": "Dropbox",
  "onedrive": "OneDrive",
  "box": "Box",
  // Databases
  "postgres": "PostgreSQL",
  "postgrestool": "PostgreSQL",
  "mysql": "MySQL",
  "mysqltool": "MySQL",
  "mongodb": "MongoDB",
  "mongodbtool": "MongoDB",
  "redis": "Redis",
  "airtable": "Airtable",
  "airtabletool": "Airtable",
  "notion": "Notion",
  "supabase": "Supabase",
  // Project Management
  "jira": "Jira",
  "jiratool": "Jira",
  "github": "GitHub",
  "gitlab": "GitLab",
  "trello": "Trello",
  "asana": "Asana",
  "mondaycom": "Monday.com",
  // AI/ML Services
  "openai": "OpenAI",
  "anthropic": "Anthropic",
  "huggingface": "Hugging Face",
  "humanticai": "Humantic AI",
  // Social Media
  "linkedin": "LinkedIn",
  "twitter": "Twitter/X",
  "twittertool": "Twitter/X",
  "facebook": "Facebook",
  "instagram": "Instagram",
  // E-commerce
  "shopify": "Shopify",
  "stripe": "Stripe",
  "paypal": "PayPal",
  "woocommerce": "WooCommerce",
  "woocommercetool": "WooCommerce",
  // Analytics
  "googleanalytics": "Google Analytics",
  "mixpanel": "Mixpanel",
  // Calendar & Tasks
  "googlecalendar": "Google Calendar",
  "googlecalendartool": "Google Calendar",
  "googletasks": "Google Tasks",
  "googletaskstool": "Google Tasks",
  "cal": "Cal.com",
  "calendly": "Calendly",
  // Forms & Surveys
  "typeform": "Typeform",
  "googleforms": "Google Forms",
  "form": "Form Trigger",
  "jotform": "JotForm",
  "wufoo": "Wufoo",
  // Development Tools
  "webhook": "Webhook",
  "httprequest": "HTTP Request",
  "graphql": "GraphQL",
  "sse": "Server-Sent Events",
  "youtube": "YouTube",
};

// Nodes to ignore as integrations
const utilityNodes = new Set([
  "set",
  "function",
  "code",
  "if",
  "switch",
  "merge",
  "split",
  "splitinbatches",
  "splitout",
  "stickynote",
  "stickynote",
  "wait",
  "schedule",
  "cron",
  "manual",
  "noop",
  "noop",
  "error",
  "stopanderror",
  "limit",
  "aggregate",
  "summarize",
  "filter",
  "sort",
  "removeduplicates",
  "datetime",
  "extractfromfile",
  "converttofile",
  "readbinaryfile",
  "readbinaryfiles",
  "writebinaryfile",
  "executiondata",
  "executeworkflow",
  "executecommand",
  "respondtowebhook"
]);

export function isN8nWorkflow(json: unknown): json is { nodes: any[]; connections: any } {
  if (typeof json !== 'object' || json === null) return false;
  const obj = json as Record<string, any>;
  return Array.isArray(obj.nodes) && typeof obj.connections === 'object';
}

export function extractNodeTypes(nodes: WorkflowNode[]): string[] {
  return nodes.map(n => n.type);
}

export function extractIntegrations(nodes: WorkflowNode[]): string[] {
  const integrationsSet = new Set<string>();

  for (const node of nodes) {
    const nodeType = node.type || '';
    const nodeNameLower = (node.name || '').toLowerCase();

    let serviceKey = '';

    if (nodeType.startsWith('n8n-nodes-base.')) {
      serviceKey = nodeType.replace('n8n-nodes-base.', '').toLowerCase();
      // Remove trigger suffixes
      serviceKey = serviceKey.replace('trigger', '');
    } else if (nodeType.startsWith('@n8n/')) {
      const parts = nodeType.split('.');
      serviceKey = (parts[parts.length - 1] || '').toLowerCase().replace('trigger', '');
    } else if (nodeType.includes('.')) {
      const parts = nodeType.split('.');
      serviceKey = parts[0].toLowerCase().replace('n8n-nodes-', '');
    } else {
      serviceKey = nodeType.toLowerCase().replace('trigger', '');
    }

    // Ignore utilities
    if (utilityNodes.has(serviceKey)) {
      continue;
    }

    let mappedName = serviceMappings[serviceKey];

    // Fallback search inside node name for common words
    if (!mappedName) {
      for (const [key, value] of Object.entries(serviceMappings)) {
        if (nodeNameLower.includes(key)) {
          // Avoid matching cal inside calcslive
          if (key === 'cal' && (nodeNameLower.includes('calc') || nodeNameLower.includes('calculation'))) {
            continue;
          }
          mappedName = value;
          break;
        }
      }
    }

    if (mappedName) {
      integrationsSet.add(mappedName);
    } else if (serviceKey && serviceKey !== 'trigger' && serviceKey.trim() !== '') {
      // Capitalize first letter as fallback
      const capitalized = serviceKey.charAt(0).toUpperCase() + serviceKey.slice(1);
      integrationsSet.add(capitalized);
    }
  }

  return Array.from(integrationsSet);
}

export function extractTriggers(nodes: WorkflowNode[]): string[] {
  const triggers: string[] = [];
  for (const node of nodes) {
    const typeLower = (node.type || '').toLowerCase();
    const nameLower = (node.name || '').toLowerCase();

    if (typeLower.includes('trigger') || typeLower.includes('webhook') || typeLower.includes('cron') || typeLower.includes('schedule') || nameLower.includes('trigger') || nameLower.includes('webhook')) {
      triggers.push(node.name || node.type);
    }
  }
  return triggers;
}

export function extractCredentialReferences(nodes: WorkflowNode[]): string[] {
  const credentials: string[] = [];
  for (const node of nodes) {
    if (node.credentials) {
      for (const credType of Object.keys(node.credentials)) {
        credentials.push(credType);
      }
    }
  }
  return Array.from(new Set(credentials));
}

export function extractExternalUrls(nodes: WorkflowNode[]): string[] {
  const urls: string[] = [];
  const urlRegex = /https?:\/\/[^\s"']+/g;

  const searchParams = (obj: any) => {
    if (!obj) return;
    if (typeof obj === 'string') {
      const matches = obj.match(urlRegex);
      if (matches) urls.push(...matches);
    } else if (typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        searchParams(obj[key]);
      }
    }
  };

  for (const node of nodes) {
    if (node.parameters) {
      searchParams(node.parameters);
    }
  }

  return Array.from(new Set(urls));
}

export function detectAINodes(nodes: WorkflowNode[]): string[] {
  const aiNodes: string[] = [];
  for (const node of nodes) {
    const typeLower = (node.type || '').toLowerCase();
    if (typeLower.includes('langchain') || typeLower.includes('openai') || typeLower.includes('anthropic') || typeLower.includes('gemini') || typeLower.includes('ai') || typeLower.includes('cohere') || typeLower.includes('ollama')) {
      aiNodes.push(node.name);
    }
  }
  return aiNodes;
}

export function detectCommunityNodes(nodes: WorkflowNode[]): string[] {
  const community: string[] = [];
  for (const node of nodes) {
    const type = node.type || '';
    // Custom/Community nodes are non-standard. Standard: n8n-nodes-base.* or @n8n/*
    if (type && !type.startsWith('n8n-nodes-base.') && !type.startsWith('@n8n/')) {
      community.push(type);
    }
  }
  return community;
}

export function parseWorkflow(json: unknown): {
  name: string;
  nodes: WorkflowNode[];
  connections: Record<string, WorkflowConnection>;
  nodeCount: number;
  integrationCount: number;
  integrations: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedSetupTime: string;
  triggerType: string;
} {
  if (!isN8nWorkflow(json)) {
    throw new Error('Invalid n8n workflow file format');
  }

  const name = (json as any).name || 'Unnamed Workflow';
  const nodes = (json as any).nodes as WorkflowNode[];
  const connections = (json as any).connections as Record<string, WorkflowConnection>;

  const integrations = extractIntegrations(nodes);
  const nodeCount = nodes.length;

  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
  if (nodeCount > 5 && nodeCount <= 15) {
    difficulty = 'Intermediate';
  } else if (nodeCount > 15) {
    difficulty = 'Advanced';
  }

  const minutes = Math.max(5, nodeCount * 1.5);
  const estimatedSetupTime = `${Math.ceil(minutes / 5) * 5} Mins`;

  // Detect primary trigger type
  let triggerType = 'Manual';
  const triggerList = extractTriggers(nodes);
  if (triggerList.length > 0) {
    const hasWebhook = triggerList.some(t => t.toLowerCase().includes('webhook'));
    const hasSchedule = triggerList.some(t => t.toLowerCase().includes('schedule') || t.toLowerCase().includes('cron'));
    if (hasWebhook) triggerType = 'Webhook';
    else if (hasSchedule) triggerType = 'Scheduled';
    else triggerType = 'Event-Driven';
  }

  return {
    name,
    nodes,
    connections,
    nodeCount,
    integrationCount: integrations.length,
    integrations,
    difficulty,
    estimatedSetupTime,
    triggerType,
  };
}
