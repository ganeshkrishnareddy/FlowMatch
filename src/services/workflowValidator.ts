import { WorkflowValidationReport, ValidationStatusType } from '../types/workflow';

export function validateWorkflow(
  workflowId: string,
  workflowJson: any
): WorkflowValidationReport {
  const issues: string[] = [];
  const validatedAt = new Date().toISOString();
  const reportId = Math.random().toString(36).substr(2, 9);

  // 1. Root verification
  if (!workflowJson || typeof workflowJson !== 'object') {
    issues.push('Workflow JSON is not a valid object or is empty.');
    return { id: reportId, workflowId, status: 'Invalid', issues, validatedAt };
  }

  const nodes = workflowJson.nodes;
  const connections = workflowJson.connections;

  // 2. Nodes list verification
  if (!Array.isArray(nodes)) {
    issues.push('Workflow is missing a valid "nodes" array.');
    return { id: reportId, workflowId, status: 'Invalid', issues, validatedAt };
  }

  // 3. Connections map verification
  if (!connections || typeof connections !== 'object') {
    issues.push('Workflow is missing a valid "connections" object.');
    return { id: reportId, workflowId, status: 'Invalid', issues, validatedAt };
  }

  // 4. Minimum node count check
  if (nodes.length === 0) {
    issues.push('Workflow contains 0 nodes. At least one node is required.');
    return { id: reportId, workflowId, status: 'Invalid', issues, validatedAt };
  }

  const nodeNames = new Set<string>();
  const nodeIds = new Set<string>();
  const nodeNameMap = new Map<string, any>();

  // 5. Individual node check
  for (const node of nodes) {
    if (!node || typeof node !== 'object') {
      issues.push('Contains an invalid or null node item.');
      continue;
    }

    const nodeName = node.name;
    const nodeType = node.type;
    const nodeId = node.id;

    if (!nodeName) {
      issues.push('Found a node without a "name" property.');
    } else {
      if (nodeNames.has(nodeName)) {
        issues.push(`Duplicate node name detected: "${nodeName}". Node names must be unique.`);
      }
      nodeNames.add(nodeName);
      nodeNameMap.set(nodeName, node);
    }

    if (nodeId) {
      nodeIds.add(nodeId);
    }

    if (!nodeType) {
      issues.push(`Node "${nodeName || 'unknown'}" is missing its "type" identifier.`);
    } else if (
      !nodeType.startsWith('n8n-nodes-base.') &&
      !nodeType.startsWith('@n8n/') &&
      !nodeType.includes('.') &&
      nodeType !== 'trigger'
    ) {
      issues.push(`Node "${nodeName || 'unknown'}" has a non-standard custom type name: "${nodeType}".`);
    }

    // Check parameters for placeholder values
    if (node.parameters) {
      const paramStr = JSON.stringify(node.parameters);
      if (paramStr.includes('YOUR_API_KEY') || paramStr.includes('INSERT_API_KEY') || paramStr.includes('PLACEHOLDER')) {
        issues.push(`Node "${nodeName || 'unknown'}" contains default placeholder API key / credential markers.`);
      }
    }
  }

  // 6. Connections check
  for (const [srcNode, srcNodeConns] of Object.entries(connections)) {
    if (!nodeNames.has(srcNode) && !nodeIds.has(srcNode)) {
      issues.push(`Connection references source node "${srcNode}" which does not exist in the nodes array.`);
      continue;
    }

    if (srcNodeConns && typeof srcNodeConns === 'object') {
      for (const [connType, paths] of Object.entries(srcNodeConns)) {
        if (Array.isArray(paths)) {
          for (const pathGroup of paths) {
            if (Array.isArray(pathGroup)) {
              for (const target of pathGroup) {
                if (!target || typeof target !== 'object') {
                  issues.push(`Connection from "${srcNode}" has a malformed target configuration.`);
                  continue;
                }
                const targetNode = target.node;
                // Ignore virtual error-handler targets
                if (targetNode.startsWith('error-handler-')) {
                  continue;
                }
                if (!nodeNames.has(targetNode) && !nodeIds.has(targetNode)) {
                  issues.push(`Connection from "${srcNode}" points to target node "${targetNode}" which does not exist in the nodes array.`);
                }
              }
            }
          }
        }
      }
    }
  }

  // 7. Structural completeness check (Needs at least one Trigger and one Action if nodeCount > 1)
  if (nodes.length > 1) {
    let hasTrigger = false;
    let hasAction = false;
    const utilityTypes = ['noop', 'stickynote', 'set', 'if', 'switch', 'merge', 'split', 'wait'];

    for (const node of nodes) {
      const typeLower = (node.type || '').toLowerCase();
      if (typeLower.includes('trigger') || typeLower.includes('webhook') || typeLower.includes('cron') || typeLower.includes('schedule') || typeLower.includes('manual')) {
        hasTrigger = true;
      } else {
        const baseType = typeLower.replace('n8n-nodes-base.', '').replace('@n8n/', '');
        if (!utilityTypes.some(ut => baseType.includes(ut))) {
          hasAction = true;
        }
      }
    }

    if (!hasTrigger) {
      issues.push('Workflow does not contain a recognized trigger node (e.g. Webhook, Schedule/Cron, or Manual trigger).');
    }
    if (!hasAction) {
      issues.push('Workflow does not contain an active integrations / service node (e.g. Gmail, Google Sheets, Slack). It consists entirely of trigger or helper utilities.');
    }
  }

  // Deduce validation status
  let status: ValidationStatusType = 'Valid';
  const hasCriticalIssues = issues.some(i => 
    i.includes('missing a valid') || 
    i.includes('Duplicate node name') || 
    i.includes('0 nodes') ||
    i.includes('not a valid object')
  );

  if (hasCriticalIssues) {
    status = 'Invalid';
  } else if (issues.length > 0) {
    status = 'Valid With Warnings';
  }

  return {
    id: reportId,
    workflowId,
    status,
    issues,
    validatedAt,
  };
}
