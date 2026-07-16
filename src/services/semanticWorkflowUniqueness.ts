import { WorkflowSpecification } from '../types/workflowSpecification';

const genericTerms = [
  "automation", "workflow", "automate", "automated", "n8n", "process", "system", "tool", "integration"
];

const genericRegex = new RegExp(`\\b(${genericTerms.join('|')})\\b`, 'gi');

function cleanString(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(genericRegex, '').replace(/\s+/g, ' ').trim();
}

function wordOverlap(s1: string, s2: string): number {
  const w1 = new Set(cleanString(s1).split(/\s+/).filter(w => w.length > 3));
  const w2 = new Set(cleanString(s2).split(/\s+/).filter(w => w.length > 3));
  if (w1.size === 0 || w2.size === 0) return 0;
  const intersection = new Set([...w1].filter(x => w2.has(x)));
  const union = new Set([...w1, ...w2]);
  return intersection.size / union.size;
}

export function calculateSemanticSimilarity(
  spec1: WorkflowSpecification,
  spec2: WorkflowSpecification
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Business problem similarity (25%)
  const probSim = wordOverlap(spec1.businessProblem, spec2.businessProblem);
  score += probSim * 25;
  if (probSim > 0.8) reasons.push(`Business problems are highly similar (${Math.round(probSim * 100)}% match)`);

  // 2. Workflow step similarity (25%)
  const stepStr1 = spec1.workflowSteps.join(' ');
  const stepStr2 = spec2.workflowSteps.join(' ');
  const stepSim = wordOverlap(stepStr1, stepStr2);
  score += stepSim * 25;
  if (stepSim > 0.8) reasons.push(`Workflow step descriptions are highly similar (${Math.round(stepSim * 100)}% match)`);

  // 3. Integration combination similarity (15%)
  const i1 = new Set(spec1.requiredIntegrations);
  const i2 = new Set(spec2.requiredIntegrations);
  const intersection = new Set([...i1].filter(x => i2.has(x)));
  const union = new Set([...i1, ...i2]);
  const integrationSim = union.size > 0 ? intersection.size / union.size : 1;
  score += integrationSim * 15;
  if (integrationSim > 0.9) reasons.push(`Integrations overlap matches highly (${Math.round(integrationSim * 100)}% match)`);

  // 4. Architecture pattern similarity (15%)
  const patternSim = spec1.architecturePattern === spec2.architecturePattern ? 15 : 0;
  score += patternSim;
  if (patternSim > 0) reasons.push(`Identical architecture pattern used (${spec1.architecturePattern})`);

  // 5. Trigger similarity (10%)
  const triggerSim = spec1.triggerType === spec2.triggerType ? 10 : 0;
  score += triggerSim;
  if (triggerSim > 0) reasons.push(`Identical trigger type used (${spec1.triggerType})`);

  // 6. Expected output similarity (10%)
  const outputSim = wordOverlap(spec1.expectedOutput, spec2.expectedOutput);
  score += outputSim * 10;
  if (outputSim > 0.8) reasons.push(`Expected outputs match closely (${Math.round(outputSim * 100)}% match)`);

  return {
    score: Math.round(score),
    reasons,
  };
}

export function verifySemanticUniqueness(
  spec: WorkflowSpecification,
  existingSpecs: WorkflowSpecification[]
): { isUnique: boolean; similarity: number; status: 'unique' | 'flagged' | 'duplicate'; matchingReasons: string[] } {
  let maxScore = 0;
  let bestReasons: string[] = [];

  for (const ext of existingSpecs) {
    if (ext.id === spec.id) continue;
    const res = calculateSemanticSimilarity(spec, ext);
    if (res.score > maxScore) {
      maxScore = res.score;
      bestReasons = res.reasons;
    }
  }

  if (maxScore >= 92) {
    return { isUnique: false, similarity: maxScore, status: 'duplicate', matchingReasons: bestReasons };
  } else if (maxScore >= 85) {
    return { isUnique: true, similarity: maxScore, status: 'flagged', matchingReasons: bestReasons };
  }

  return { isUnique: true, similarity: maxScore, status: 'unique', matchingReasons: [] };
}
