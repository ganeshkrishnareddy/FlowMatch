import { Workflow } from '../types/workflow';
import { getCleanNodeName } from './nodeDisplayName';

export function cleanDescription(description: string, workflow: Workflow): string {
  let text = description || '';

  // Remove stickyNote or Sticky Note indicators
  text = text.replace(/stickyNote/gi, '');
  text = text.replace(/Sticky Note/gi, '');

  // Normalize other common raw node keys
  const terms: Record<string, string> = {
    'gmailTrigger': 'Gmail',
    'telegramTrigger': 'Telegram',
    'googleSheets': 'Google Sheets',
    'httpRequest': 'HTTP Request',
    'lmChatOpenAi': 'OpenAI',
    'googleDrive': 'Google Drive',
    'splitOut': 'Data Splitting Step',
    'executeWorkflow': 'another workflow',
    'acuitySchedulingTrigger': 'Acuity Scheduling',
    'activeCampaign': 'ActiveCampaign',
    'affinity': 'Affinity',
    'wooCommerce': 'WooCommerce',
    'microsoftOutlook': 'Microsoft Outlook',
  };

  Object.entries(terms).forEach(([key, val]) => {
    const regex = new RegExp(key, 'gi');
    text = text.replace(regex, val);
  });

  // Clean trailing spaces, double spaces, and punctuation artifacts from removals
  text = text.replace(/\s+/g, ' ').trim();
  text = text.replace(/, ,/g, ',').replace(/,,/g, ',');
  text = text.replace(/\(\s*\)/g, '');

  // If description was very low quality or empty, generate a descriptive one
  if (text.length < 30 || text.toLowerCase().includes('automated workflow:') || text.toLowerCase().includes('integrates')) {
    const nodes: any[] = Array.isArray(workflow.originalWorkflowJson?.nodes) 
      ? workflow.originalWorkflowJson.nodes 
      : [];
    const ignoredNodes = ['stickyNote', 'set', 'merge', 'noOp', 'switch', 'if'];
    const integrations = nodes
      .filter(n => !ignoredNodes.some(ign => n.type.toLowerCase().includes(ign.toLowerCase())))
      .map(n => getCleanNodeName(n.type));

    const uniqueInts = Array.from(new Set(integrations));
    if (uniqueInts.length > 1) {
      text = `Connect ${uniqueInts.slice(0, 3).join(', ')} to orchestrate actions and manage data flows automatically.`;
    } else if (uniqueInts.length === 1) {
      text = `Automate triggers and run background logic with ${uniqueInts[0]} automation step.`;
    } else {
      text = `Run structured tasks, execute webhook callbacks, and route data using custom logic.`;
    }
  }

  // Ensure length constraints
  if (text.length > 240) {
    text = text.slice(0, 237) + '...';
  }

  return text;
}
