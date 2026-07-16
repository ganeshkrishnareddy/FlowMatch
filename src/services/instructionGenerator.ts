import { WorkflowInstructions, WorkflowNode } from '../types/workflow';
import { extractIntegrations, extractCredentialReferences, extractTriggers } from './workflowParser';

export function generateWorkflowInstructions(
  workflowName: string,
  nodes: WorkflowNode[]
): WorkflowInstructions {
  const integrations = extractIntegrations(nodes);
  const credRefs = extractCredentialReferences(nodes);
  const triggers = extractTriggers(nodes);

  // 1. Overview and What It Does
  const overview = `This workflow automates processes involving ${integrations.join(', ')}.`;
  
  let whatThisWorkflowDoes = `This automation triggers whenever a new event occurs in the trigger node, processes the data, and connects with integrations: ${integrations.join(' and ')}.`;
  if (triggers.length > 0) {
    whatThisWorkflowDoes = `This automation starts when triggered by "${triggers[0]}". It then executes sequential steps through ${nodes.length} nodes, connecting services like ${integrations.slice(0, 3).join(', ')} to automate your manual tasks.`;
  }

  // 2. Best For
  let bestFor = 'Optimizing multi-service digital operational workflows and developer integrations.';
  if (integrations.includes('Gmail') || integrations.includes('Slack')) {
    bestFor = 'Teams needing real-time messaging, immediate notification alerts, and automated email operations.';
  } else if (integrations.includes('Google Sheets') || integrations.includes('Airtable') || integrations.includes('Notion')) {
    bestFor = 'Businesses looking to synchronize customer database records, track sales leads, and manage spreadsheet data without manual copy-pasting.';
  } else if (integrations.includes('OpenAI') || integrations.includes('Anthropic')) {
    bestFor = 'Adding AI-powered natural language qualification, smart data summaries, or auto-reply generation to existing datasets.';
  }

  // 3. Prerequisites
  const prerequisites: string[] = [
    'An active n8n instance installed locally, in a Docker container, or hosted on n8n Cloud.',
    'Basic familiarity with importing JSON templates in n8n.'
  ];

  // 4. Required Accounts
  const requiredAccounts: string[] = [];
  const requiredCredentials: string[] = [];

  for (const integration of integrations) {
    requiredAccounts.push(`${integration} Account`);
  }

  for (const cred of credRefs) {
    // Format credential names beautifully
    const formattedCred = cred
      .replace('Api', ' API')
      .replace('OAuth2', ' OAuth2')
      .replace(/([A-Z])/g, ' $1')
      .trim();
    requiredCredentials.push(`${formattedCred} details`);
  }
  if (requiredCredentials.length === 0) {
    requiredCredentials.push('No custom credentials required for utility-only operations.');
  }

  // 5. Steps setup
  const importSteps: string[] = [
    'Copy the workflow JSON to your clipboard or download the JSON file.',
    'Open your n8n workspace, click on the options menu, and select "Import from File" or paste the JSON content directly onto the empty canvas.'
  ];

  const credentialSteps: string[] = [];
  if (credRefs.length > 0) {
    credentialSteps.push('Double-click on each integration node marked with a warning badge.');
    credentialSteps.push(`Configure credentials by selecting your saved connection or clicking "Create New Credential" for: ${credRefs.join(', ')}.`);
  } else {
    credentialSteps.push('This workflow uses generic or utility nodes and does not require third-party credential authentication.');
  }

  // 6. Trigger Configuration
  const triggerConfiguration: string[] = [];
  const triggerNodes = nodes.filter(n => {
    const t = (n.type || '').toLowerCase();
    return t.includes('trigger') || t.includes('webhook') || t.includes('cron') || t.includes('schedule');
  });

  if (triggerNodes.length > 0) {
    for (const tn of triggerNodes) {
      const typeLower = (tn.type || '').toLowerCase();
      if (typeLower.includes('webhook')) {
        triggerConfiguration.push(`Locate the webhook node named "${tn.name}".`);
        triggerConfiguration.push('Copy the Test Webhook URL provided by n8n.');
        triggerConfiguration.push('Configure your source application (e.g. Stripe, Typeform) to send event payloads to this URL.');
      } else if (typeLower.includes('cron') || typeLower.includes('schedule')) {
        triggerConfiguration.push(`Open the scheduler node "${tn.name}".`);
        triggerConfiguration.push('Adjust the execution intervals (e.g., Every hour, Daily, or Custom CRON expression) according to your preferences.');
      } else {
        triggerConfiguration.push(`Verify the settings of the trigger node "${tn.name}".`);
      }
    }
  } else {
    triggerConfiguration.push('No trigger node detected. Set up a Manual or Webhook trigger to initiate the workflow.');
  }

  // 7. Integration Configuration
  const integrationConfiguration: string[] = [];
  const actionNodes = nodes.filter(n => {
    const t = (n.type || '').toLowerCase();
    return !t.includes('trigger') && !t.includes('webhook') && !t.includes('cron') && !t.includes('schedule') && !t.includes('set') && !t.includes('code');
  });

  if (actionNodes.length > 0) {
    for (const an of actionNodes) {
      const typeLower = (an.type || '').toLowerCase();
      if (typeLower.includes('googlesheets')) {
        integrationConfiguration.push(`Open the "${an.name}" Google Sheets node.`);
        integrationConfiguration.push('Ensure you select the spreadsheet file and specific tab/sheet from the dropdown menus.');
        integrationConfiguration.push('Map the input JSON keys to your target sheet columns.');
      } else if (typeLower.includes('slack')) {
        integrationConfiguration.push(`Open the "${an.name}" Slack node.`);
        integrationConfiguration.push('Select the Channel or User ID where message notifications should be delivered.');
      } else if (typeLower.includes('openai')) {
        integrationConfiguration.push(`Open the AI node "${an.name}".`);
        integrationConfiguration.push('Adjust the Model settings (e.g. gpt-4o, gpt-3.5-turbo) and write or refine the System Prompt parameters.');
      } else {
        integrationConfiguration.push(`Open the "${an.name}" node (${an.type}) and configure the action parameters, mappings, and fields.`);
      }
    }
  } else {
    integrationConfiguration.push('Verify parameters on all processing nodes.');
  }

  // 8. Variable configuration
  const variableConfiguration: string[] = [];
  const setNodes = nodes.filter(n => (n.type || '').toLowerCase().includes('set'));
  if (setNodes.length > 0) {
    for (const sn of setNodes) {
      variableConfiguration.push(`Locate the Set/Edit fields node "${sn.name}".`);
      variableConfiguration.push('Define or edit values for variables that are referenced in downstream nodes.');
    }
  } else {
    variableConfiguration.push('No global variables node (Set node) is present. If you need dynamic constants, add a Set node after the trigger.');
  }

  // 9. Testing & Activation Steps
  const testingSteps: string[] = [
    'Click the "Test step" or "Listen for test event" button on your Trigger node.',
    'Send a test trigger from your source service (e.g. fill a test form or trigger a webhook trigger).',
    'Verify that the node canvas lights up green, indicating successful data flow.',
    'Open the final destination node to confirm that output records were saved correctly.'
  ];

  const activationSteps: string[] = [
    'Once testing finishes successfully, toggle the active switch in the top right corner of the n8n interface from "Inactive" to "Active".',
    'Your workflow is now live and running in the background!'
  ];

  // 10. Expected Result
  let expectedResult = 'Upon trigger activation, inputs will flow through the configured nodes and execute actions successfully.';
  if (integrations.includes('Google Sheets') && integrations.includes('Gmail')) {
    expectedResult = 'Incoming triggers will qualified/formatted, new rows will be written to Google Sheets, and email replies or alerts will be sent automatically.';
  } else if (integrations.includes('Slack')) {
    expectedResult = 'Your Slack channel will receive customized real-time notifications when the automation executes.';
  }

  // 11. Troubleshooting
  const troubleshooting: string[] = [
    'Check credential warning symbols. Most workflow issues stem from expired OAuth connections or missing API permissions.',
    'Verify that the data keys coming from your Trigger node match the exact names mapped in subsequent nodes (e.g., {{ $json.body.email }}).',
    'Open the Execution history tab in n8n to view logs and determine which node failed.'
  ];

  // 12. Security Notes
  const securityNotes: string[] = [
    'Never hardcode API keys, passwords, or authentication bearer tokens in the plain text fields of node parameters.',
    'If you download or share this workflow JSON, sanitize any sensitive parameters or configuration nodes.'
  ];

  // 13. Customization Ideas
  const customizationIdeas: string[] = [
    `Add an email node at the end to notify you of successful executions.`,
    `Incorporate an AI LLM node to summarize trigger payloads before writing them to integrations.`
  ];

  return {
    prerequisites,
    setupInstructions: [
      'Download the JSON configuration for this workflow.',
      'Import the JSON into n8n.',
      'Ensure you set up credentials for all connected integrations.',
      'Test your trigger and run execution.'
    ],
    requiredAccounts,
    requiredCredentials,
    configurationSteps: [
      ...triggerConfiguration,
      ...integrationConfiguration,
      ...variableConfiguration
    ],
    testingSteps,
    expectedResult,
    troubleshooting,
    securityNotes,
    customizationIdeas
  };
}
