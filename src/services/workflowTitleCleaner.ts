import { Workflow } from '../types/workflow';
import { getCleanNodeName } from './nodeDisplayName';

export function isLowQualityWorkflowTitle(title: string): boolean {
  const t = title.trim();
  const lower = t.toLowerCase();

  // Pattern checks
  if (lower.endsWith('trigger workflow')) return true;
  if (lower.endsWith('node workflow')) return true;
  if (lower.endsWith('api workflow')) return true;
  if (lower.endsWith('openai workflow')) return true;
  if (lower.endsWith('stickynote workflow')) return true;
  
  // Single word + Workflow
  if (/^[a-zA-Z0-9]+ workflow$/i.test(t)) return true;

  // No spaces
  if (!t.includes(' ') && t.length > 5) return true;

  // Raw pascal/camelcase or starts/ends with raw node indicators
  if (/^[a-z]+[A-Z]/g.test(t)) return true;

  return false;
}

export function cleanWorkflowTitle(workflow: Workflow): string {
  const originalTitle = workflow.name;
  if (!isLowQualityWorkflowTitle(originalTitle)) {
    return originalTitle;
  }

  // Get nodes from JSON
  const nodes: any[] = Array.isArray(workflow.originalWorkflowJson?.nodes) 
    ? workflow.originalWorkflowJson.nodes 
    : [];

  // Exclude Sticky Notes, Set, Merge, NoOp, switch etc from core action determinations
  const ignoredNodes = ['n8n-nodes-base.stickyNote', 'n8n-nodes-base.set', 'n8n-nodes-base.merge', 'n8n-nodes-base.noOp', 'n8n-nodes-base.switch', 'n8n-nodes-base.if'];
  const meaningfulNodes = nodes.filter(n => !ignoredNodes.some(ign => n.type.toLowerCase().includes(ign.toLowerCase())));

  // Find trigger and actions
  const triggerNode = nodes.find(n => n.type.toLowerCase().includes('trigger') || n.type.toLowerCase().includes('webhook') || n.type.toLowerCase().includes('cron') || n.type.toLowerCase().includes('manual'));
  
  const triggerName = triggerNode ? getCleanNodeName(triggerNode.type) : 'Event';
  const actions = meaningfulNodes
    .filter(n => n !== triggerNode)
    .map(n => getCleanNodeName(n.type));

  const uniqueActions = Array.from(new Set(actions)).filter(a => a !== triggerName);

  if (uniqueActions.length > 0) {
    const actionList = uniqueActions.slice(0, 2).join(' and ');
    if (triggerName.toLowerCase().includes('webhook')) {
      return `Receive Webhook Requests and Route Data to ${actionList}`;
    }
    if (triggerName.toLowerCase().includes('schedule') || triggerName.toLowerCase().includes('cron')) {
      return `Schedule Automated Task to Run with ${actionList}`;
    }
    return `Sync New ${triggerName} Data to ${actionList}`;
  }

  if (triggerNode) {
    return `Automate Actions on New ${triggerName} Events`;
  }

  return `Trigger Automated Process Workflow`;
}
