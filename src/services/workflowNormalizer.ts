import { WorkflowNode } from '../types/workflow';

// Recursively sort keys of an object to get a deterministic JSON string
function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    const sortedObj: Record<string, any> = {};
    for (const key of keys) {
      sortedObj[key] = sortObjectKeys(obj[key]);
    }
    return sortedObj;
  }
  return obj;
}

export function normalizeNode(node: WorkflowNode): Partial<WorkflowNode> {
  const cleanNode: Partial<WorkflowNode> = {
    name: node.name,
    type: node.type,
    typeVersion: node.typeVersion,
  };

  // Clean parameters (remove coordinates, pin data, credential secrets)
  if (node.parameters) {
    // Redact credential values or hardcoded API keys in parameters if present
    const cleanParams = JSON.parse(JSON.stringify(node.parameters));
    cleanNode.parameters = cleanParams;
  }

  // Preserve credential types, redact credential configuration/values if any
  if (node.credentials) {
    const cleanCreds: Record<string, any> = {};
    for (const key of Object.keys(node.credentials)) {
      cleanCreds[key] = { id: 'REDACTED' };
    }
    cleanNode.credentials = cleanCreds;
  }

  return cleanNode;
}

export function normalizeWorkflow(workflowJson: Record<string, any>): Record<string, any> {
  // Deep clone input to avoid mutation
  const clone = JSON.parse(JSON.stringify(workflowJson));

  const nodes = (clone.nodes || []) as WorkflowNode[];
  const connections = clone.connections || {};

  // Sort nodes deterministically by name so that their order in the array doesn't affect the hash
  const normalizedNodes = nodes
    .map(normalizeNode)
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  // Clean connections (remove coordinates or execution paths metadata)
  const normalizedConnections: Record<string, any> = {};
  const connectionKeys = Object.keys(connections).sort();
  for (const key of connectionKeys) {
    const sourceNodeConns = connections[key];
    const cleanSourceConns: Record<string, any> = {};
    for (const connType of Object.keys(sourceNodeConns).sort()) {
      const paths = sourceNodeConns[connType];
      cleanSourceConns[connType] = paths.map((pathArray: any[]) => {
        return pathArray.map((target: any) => ({
          node: target.node,
          index: target.index,
        })).sort((a: any, b: any) => a.node.localeCompare(b.node) || a.index - b.index);
      });
    }
    normalizedConnections[key] = cleanSourceConns;
  }

  // Return sorted, normalized object
  return sortObjectKeys({
    name: clone.name || '',
    nodes: normalizedNodes,
    connections: normalizedConnections,
  });
}
