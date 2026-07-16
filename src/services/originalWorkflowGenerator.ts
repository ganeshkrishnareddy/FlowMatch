import { WorkflowSpecification } from '../types/workflowSpecification';

// Maps common integration names to valid n8n node types
const nameToNodeType: Record<string, string> = {
  'Google Sheets': 'n8n-nodes-base.googleSheets',
  'Gmail': 'n8n-nodes-base.gmail',
  'Slack': 'n8n-nodes-base.slack',
  'Discord': 'n8n-nodes-base.discord',
  'Telegram': 'n8n-nodes-base.telegram',
  'Notion': 'n8n-nodes-base.notion',
  'Airtable': 'n8n-nodes-base.airtable',
  'GitHub': 'n8n-nodes-base.github',
  'GitLab': 'n8n-nodes-base.gitlab',
  'OpenAI': '@n8n/n8n-nodes-langchain.openAi',
  'WordPress': 'n8n-nodes-base.wordpress',
  'Shopify': 'n8n-nodes-base.shopify',
  'WooCommerce': 'n8n-nodes-base.woocommerce',
  'Stripe': 'n8n-nodes-base.stripe',
  'PostgreSQL': 'n8n-nodes-base.postgres',
  'MySQL': 'n8n-nodes-base.mysql',
  'MongoDB': 'n8n-nodes-base.mongodb',
  'Supabase': 'n8n-nodes-base.supabase',
  'HubSpot': 'n8n-nodes-base.hubspot',
  'Webhook': 'n8n-nodes-base.webhook',
  'Schedule / Cron': 'n8n-nodes-base.cron',
  'Manual Trigger': 'n8n-nodes-base.manualTrigger',
  'HTTP Request': 'n8n-nodes-base.httpRequest',
};

export function generateWorkflowFromSpecification(spec: WorkflowSpecification): any {
  const nodes: any[] = [];
  const connections: Record<string, any> = {};

  // 1. Determine trigger node
  let triggerType = 'n8n-nodes-base.manualTrigger';
  let triggerName = 'Manual Trigger';
  if (spec.triggerType === 'Webhook') {
    triggerType = 'n8n-nodes-base.webhook';
    triggerName = 'Webhook Trigger';
  } else if (spec.triggerType === 'Scheduled') {
    triggerType = 'n8n-nodes-base.cron';
    triggerName = 'Schedule Cron Trigger';
  }

  // Deterministic node id generation based on spec title
  const cleanPrefix = spec.slug.replace(/[^a-zA-Z0-9]/g, '');

  const triggerNode = {
    id: `${cleanPrefix}trig`,
    name: triggerName,
    type: triggerType,
    typeVersion: 1,
    position: [100, 250],
    parameters: triggerType === 'n8n-nodes-base.webhook' ? {
      path: `${spec.slug}-webhook`,
      options: {}
    } : {}
  };
  nodes.push(triggerNode);

  // 2. Determine processing nodes based on integrations list
  let currentX = 350;
  const processNodes: any[] = [];

  // If AI category, add AI step early
  if (spec.requiredIntegrations.includes('OpenAI')) {
    const aiNode = {
      id: `${cleanPrefix}openai`,
      name: 'AI Prompt Analyzer',
      type: '@n8n/n8n-nodes-langchain.openAi',
      typeVersion: 1,
      position: [currentX, 250],
      parameters: {
        prompt: `Process inquiry details from trigger. Use safe placeholder: YOUR_API_KEY. Context: ${spec.businessProblem}`
      }
    };
    processNodes.push(aiNode);
    currentX += 250;
  }

  // Filter integrations to avoid duplicates or trigger nodes
  const actionIntegrations = spec.requiredIntegrations.filter(
    i => i !== 'OpenAI' && i !== 'Webhook' && i !== 'Schedule / Cron' && i !== 'Manual Trigger'
  );

  actionIntegrations.forEach((integration, idx) => {
    const nodeType = nameToNodeType[integration] || 'n8n-nodes-base.httpRequest';
    const nodeName = `Save to ${integration}`;
    
    // Add specific parameters to document details
    const parameters: Record<string, any> = {};
    if (integration === 'Google Sheets') {
      parameters.spreadsheetId = 'YOUR_SPREADSHEET_ID_PLACEHOLDER';
      parameters.sheetName = 'Sheet1';
    } else if (integration === 'Gmail') {
      parameters.sendTo = 'YOUR_EMAIL_ADDRESS_PLACEHOLDER';
      parameters.subject = `Automation update: ${spec.category}`;
    } else if (integration === 'Slack') {
      parameters.channelId = 'YOUR_SLACK_CHANNEL_ID_PLACEHOLDER';
    } else if (integration === 'HTTP Request') {
      parameters.url = 'https://api.service.placeholder/v1/endpoint';
      parameters.method = 'POST';
    }

    const actNode = {
      id: `${cleanPrefix}node${idx}`,
      name: nodeName,
      type: nodeType,
      typeVersion: 1,
      position: [currentX, 250],
      parameters
    };
    processNodes.push(actNode);
    currentX += 250;
  });

  nodes.push(...processNodes);

  // 3. Connect nodes in sequence
  const sequence = [triggerNode, ...processNodes];
  for (let i = 0; i < sequence.length - 1; i++) {
    const src = sequence[i];
    const target = sequence[i + 1];
    connections[src.name] = {
      main: [
        [
          {
            node: target.name,
            index: 0
          }
        ]
      ]
    };
  }

  return {
    name: spec.title,
    nodes,
    connections,
    settings: {
      executionTimeout: 300
    }
  };
}
