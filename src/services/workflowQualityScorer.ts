import { WorkflowQualityReport, ValidationStatusType, SecurityStatusType, WorkflowInstructions } from '../types/workflow';

export function calculateQualityScore(
  workflowId: string,
  validationStatus: ValidationStatusType,
  securityStatus: SecurityStatusType,
  nodeCount: number,
  hasDescription: boolean,
  hasShortDescription: boolean,
  instructions?: WorkflowInstructions,
  rawJson?: any
): WorkflowQualityReport {
  let jsonValidity = 0;
  let connectionValidity = 0;
  let clarity = 15; // Start at max, deduct for issues
  let instructionQuality = 0;
  let securityScan = 0;
  let complexity = 0;
  let metadataCompleteness = 0;
  let testingGuidance = 0;

  // 1. JSON Validity (Max 20)
  if (validationStatus === 'Valid' || validationStatus === 'Valid With Warnings') {
    jsonValidity = 20;
  }

  // 2. Connection Validity (Max 15)
  if (validationStatus === 'Valid') {
    connectionValidity = 15;
  } else if (validationStatus === 'Valid With Warnings') {
    connectionValidity = 7;
  }

  // 3. Integration configuration clarity (Max 15)
  // Scan parameters for empty configs or placeholders
  if (rawJson && Array.isArray(rawJson.nodes)) {
    let hasPlaceholders = false;
    let hasUnresolvedFields = false;

    const checkObj = (obj: any) => {
      if (!obj) return;
      if (typeof obj === 'string') {
        const lower = obj.toLowerCase();
        if (lower.includes('your_api_key') || lower.includes('placeholder') || lower.includes('insert_here')) {
          hasPlaceholders = true;
        }
      } else if (typeof obj === 'object') {
        for (const [key, val] of Object.entries(obj)) {
          // Check for empty string configurations on key names that usually demand IDs
          if (val === '' && (key.includes('Id') || key.includes('id') || key.includes('url') || key.includes('path'))) {
            hasUnresolvedFields = true;
          }
          checkObj(val);
        }
      }
    };

    for (const node of rawJson.nodes) {
      if (node.parameters) {
        checkObj(node.parameters);
      }
    }

    if (hasPlaceholders) clarity -= 5;
    if (hasUnresolvedFields) clarity -= 5;
  }

  // 4. Setup instruction quality (Max 15)
  if (instructions) {
    const hasPre = instructions.prerequisites?.length > 0;
    const hasSteps = instructions.setupInstructions?.length > 0;
    const hasCreds = instructions.requiredCredentials?.length > 0 && !instructions.requiredCredentials.some(c => c.toLowerCase().includes('no custom credentials'));

    if (hasSteps) {
      instructionQuality += 5;
    }
    if (hasPre) {
      instructionQuality += 5;
    }
    if (hasCreds) {
      instructionQuality += 5;
    }
  }

  // 5. Security Scan (Max 10)
  if (securityStatus === 'Passed') {
    securityScan = 10;
  } else if (securityStatus === 'Review Recommended') {
    securityScan = 6;
  } else {
    securityScan = 0;
  }

  // 6. Complexity (Max 10)
  if (nodeCount > 15) {
    complexity = 10; // Advanced
  } else if (nodeCount > 5) {
    complexity = 7;  // Intermediate
  } else {
    complexity = 4;  // Beginner
  }

  // 7. Metadata completeness (Max 10)
  if (hasDescription) metadataCompleteness += 5;
  if (hasShortDescription) metadataCompleteness += 5;

  // 8. Testing guidance (Max 5)
  if (instructions && instructions.testingSteps?.length > 0) {
    testingGuidance = 5;
  }

  const score = jsonValidity + connectionValidity + clarity + instructionQuality + securityScan + complexity + metadataCompleteness + testingGuidance;
  const scoredAt = new Date().toISOString();

  return {
    id: Math.random().toString(36).substr(2, 9),
    workflowId,
    score,
    breakdown: {
      jsonValidity,
      connectionValidity,
      clarity,
      instructionQuality,
      securityScan,
      complexity,
      metadataCompleteness,
      testingGuidance,
    },
    scoredAt,
  };
}

export function isEligibleForVerification(
  score: number,
  validationStatus: ValidationStatusType,
  securityStatus: SecurityStatusType
): boolean {
  return score >= 85 && validationStatus === 'Valid' && securityStatus !== 'Potential Risk';
}
