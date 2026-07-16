import { DuplicateStatusType } from '../types/workflow';

let cachedNodeCrypto: any = null;

export async function sha256(message: string): Promise<string> {
  // If in Node environment, use the dynamic import cached once
  if (typeof window === 'undefined') {
    if (!cachedNodeCrypto) {
      const cryptoName = 'crypto';
      cachedNodeCrypto = await import(/* @vite-ignore */ cryptoName);
    }
    return cachedNodeCrypto.createHash('sha256').update(message).digest('hex');
  }
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback to simple hash representation for test resilience if crypto is unavailable
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return 'fallback_' + Math.abs(hash).toString(16);
}

export function generateNodeSignature(nodes: any[]): string {
  // Sort node types alphabetically to get a signature
  return nodes.map(n => n.type || '').sort().join(',');
}

export function generateConnectionSignature(connections: any): string {
  // Extract connections and format them
  const sigs: string[] = [];
  const keys = Object.keys(connections || {}).sort();
  for (const src of keys) {
    const outputs = connections[src];
    for (const outType of Object.keys(outputs || {})) {
      const targets = outputs[outType] || [];
      for (const targetGroup of targets) {
        if (Array.isArray(targetGroup)) {
          for (const t of targetGroup) {
            sigs.push(`${src}->${t.node}`);
          }
        }
      }
    }
  }
  return sigs.sort().join('|');
}

const hashCache = new Map<string, string>();

export async function generateExactHash(normalizedJson: Record<string, any>, workflowId?: string): Promise<string> {
  if (workflowId && hashCache.has(workflowId)) {
    return hashCache.get(workflowId)!;
  }
  const hash = await sha256(JSON.stringify(normalizedJson));
  if (workflowId) {
    hashCache.set(workflowId, hash);
  }
  return hash;
}

export async function generateStructuralHash(nodes: any[], connections: any): Promise<string> {
  const nodeSig = generateNodeSignature(nodes);
  const connSig = generateConnectionSignature(connections);
  return sha256(`${nodeSig}::${connSig}`);
}

export function calculateWorkflowSimilarity(w1: {
  nodes: any[];
  connections: any;
  integrations: string[];
  triggerType: string;
}, w2: {
  nodes: any[];
  connections: any;
  integrations: string[];
  triggerType: string;
}): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Node count similarity: 5%
  const count1 = w1.nodes.length;
  const count2 = w2.nodes.length;
  const maxCount = Math.max(count1, count2);
  const nodeCountSim = maxCount > 0 ? 1 - Math.abs(count1 - count2) / maxCount : 1;
  score += nodeCountSim * 5;
  if (nodeCountSim > 0.9) reasons.push(`Node count matches closely (${count1} vs ${count2})`);

  // 2. Trigger similarity: 10%
  const triggerSim = w1.triggerType === w2.triggerType ? 1 : 0;
  score += triggerSim * 10;
  if (triggerSim === 1) reasons.push(`Trigger type matches (${w1.triggerType})`);

  // 3. Integration similarity: 20%
  const i1 = new Set(w1.integrations);
  const i2 = new Set(w2.integrations);
  const intersection = new Set([...i1].filter(x => i2.has(x)));
  const union = new Set([...i1, ...i2]);
  const integrationSim = union.size > 0 ? intersection.size / union.size : 1;
  score += integrationSim * 20;
  if (integrationSim > 0.9) reasons.push(`Integrations overlap matches highly (${Math.round(integrationSim * 100)}% match)`);

  // 4. Node type signature similarity: 35%
  const types1 = w1.nodes.map(n => n.type).sort();
  const types2 = w2.nodes.map(n => n.type).sort();
  let typeMatches = 0;
  let t2Idx = 0;
  for (const t1 of types1) {
    const foundIdx = types2.indexOf(t1, t2Idx);
    if (foundIdx !== -1) {
      typeMatches++;
      t2Idx = foundIdx + 1;
    }
  }
  const maxTypes = Math.max(types1.length, types2.length);
  const typeSim = maxTypes > 0 ? typeMatches / maxTypes : 1;
  score += typeSim * 35;
  if (typeSim > 0.9) reasons.push(`Node type profiles match closely (${Math.round(typeSim * 100)}% match)`);

  // 5. Connection graph similarity: 30%
  const sig1 = generateConnectionSignature(w1.connections).split('|').filter(Boolean);
  const sig2 = generateConnectionSignature(w2.connections).split('|').filter(Boolean);
  const connIntersection = sig1.filter(x => sig2.includes(x));
  const connUnion = Array.from(new Set([...sig1, ...sig2]));
  const connSim = connUnion.length > 0 ? connIntersection.length / connUnion.length : 1;
  score += connSim * 30;
  if (connSim > 0.8) reasons.push(`Connection topology is highly similar (${Math.round(connSim * 100)}% match)`);

  return {
    score: Math.round(score),
    reasons,
  };
}

export async function checkDuplicate(
  newWorkflow: {
    normalizedWorkflowJson: Record<string, any>;
    nodes: any[];
    connections: any;
    integrations: string[];
    triggerType: string;
  },
  existingWorkflows: Array<{
    id: string;
    normalizedWorkflowJson: Record<string, any>;
    nodes: any[];
    connections: any;
    integrations: string[];
    triggerType: string;
  }>
): Promise<{ status: DuplicateStatusType; similarity: number; matchingReasons: string[]; duplicateId?: string }> {
  // Check exact duplicate first
  const newExactHash = await generateExactHash(newWorkflow.normalizedWorkflowJson);

  for (const ext of existingWorkflows) {
    const extExactHash = await generateExactHash(ext.normalizedWorkflowJson, ext.id);
    if (newExactHash === extExactHash) {
      return {
        status: 'exact_duplicate',
        similarity: 100,
        matchingReasons: ['The normalized workflow structure is a 100% exact duplicate.'],
        duplicateId: ext.id,
      };
    }
  }

  // Check possible duplicates
  let maxScore = 0;
  let bestReasons: string[] = [];
  let duplicateId: string | undefined = undefined;

  for (const ext of existingWorkflows) {
    const result = calculateWorkflowSimilarity(newWorkflow, ext);
    if (result.score > maxScore) {
      maxScore = result.score;
      bestReasons = result.reasons;
      duplicateId = ext.id;
    }
  }

  if (maxScore >= 95) {
    return {
      status: 'possible_duplicate',
      similarity: maxScore,
      matchingReasons: bestReasons,
      duplicateId,
    };
  }

  return {
    status: 'unique',
    similarity: maxScore,
    matchingReasons: [],
  };
}
