import { SecurityFinding, SecurityScan, SecurityStatusType } from '../types/workflow';

// Redact secrets matching common key prefixes
export function redactSecret(value: string): string {
  if (value.startsWith('sk-proj-')) {
    return 'sk-proj-****REDACTED****';
  }
  if (value.startsWith('AIzaSy')) {
    return 'AIzaSy****REDACTED****';
  }
  if (value.length > 8) {
    return value.substring(0, 4) + '****REDACTED****' + value.substring(value.length - 4);
  }
  return '****REDACTED****';
}

const secretRegexes = [
  /AIzaSy[a-zA-Z0-9_\-]{33}/i, // Google API Key
  /sk-proj-[a-zA-Z0-9]{32,}/i, // OpenAI Key
  /bearer\s+[a-zA-Z0-9_\-\.]{15,}/i, // Bearer Token
  /ey[a-zA-Z0-9_\-\.]+\.ey[a-zA-Z0-9_\-\.]+\.[a-zA-Z0-9_\-\.]+/i, // JWT Token
  /aws_access_key_id\s*[:=]\s*['"]?[A-Z0-9]{20}['"]?/i, // AWS Access Key
  /aws_secret_access_key\s*[:=]\s*['"]?[a-zA-Z0-9/+=]{40}['"]?/i, // AWS Secret Key
  /-----BEGIN\s+PRIVATE\s+KEY-----/i, // SSH Private Key
];

const destructiveRegexes = [
  /\brm\s+-rf\b/i,
  /\bdel\s+\/s\b/i,
  /\bdrop\s+table\b/i,
  /\btruncate\s+table\b/i,
  /\bshutdown\b/i,
  /\breboot\b/i,
  /curl\s+.*\s*\|\s*(bash|sh)/i,
  /wget\s+.*\s*\|\s*(bash|sh)/i,
];

export function scanWorkflowSecurity(
  workflowId: string,
  nodes: any[]
): SecurityScan {
  const findings: SecurityFinding[] = [];
  let scanId = Math.random().toString(36).substr(2, 9);

  for (const node of nodes) {
    const nodeType = node.type || '';
    const nodeName = node.name || '';
    const params = node.parameters || {};

    // 1. Detect Execute Command nodes
    if (nodeType === 'n8n-nodes-base.executeCommand' || nodeType.includes('executeCommand')) {
      findings.push({
        id: `sec-${scanId}-exec-${nodeName}`,
        type: 'execute_command',
        severity: 'high',
        nodeName,
        nodeType,
        message: 'Execute Command node detected. Executing shell commands introduces critical remote code execution risks.',
        recommendation: 'Verify the shell command inputs are sanitized. If possible, replace the shell script with native integration nodes.',
      });

      // Check command parameter for destructive patterns
      const command = params.command || '';
      for (const regex of destructiveRegexes) {
        if (regex.test(command)) {
          findings.push({
            id: `sec-${scanId}-destructive-${nodeName}`,
            type: 'destructive_command',
            severity: 'critical',
            nodeName,
            nodeType,
            message: `Possible destructive command detected in parameter: "${command}"`,
            recommendation: 'Immediately remove or review this node. Destructive operations (like drop tables, system reboot, or recursive deletion) can cause catastrophic data loss.',
          });
        }
      }
    }

    // 2. Detect Code nodes
    if (nodeType === 'n8n-nodes-base.code' || nodeType.includes('function') || nodeType.includes('code')) {
      findings.push({
        id: `sec-${scanId}-code-${nodeName}`,
        type: 'code',
        severity: 'medium',
        nodeName,
        nodeType,
        message: 'Custom Code / Javascript node detected.',
        recommendation: 'Perform manual inspection of the Javascript code execution logic to ensure no malicious operations or external exfiltration exists.',
      });
    }

    // 3. Detect HTTP Request nodes
    if (nodeType === 'n8n-nodes-base.httpRequest' || nodeType.includes('httpRequest')) {
      findings.push({
        id: `sec-${scanId}-http-${nodeName}`,
        type: 'http_request',
        severity: 'low',
        nodeName,
        nodeType,
        message: 'HTTP Request node detected. External requests can fetch or send data to arbitrary servers.',
        recommendation: 'Ensure the target URL is trusted and uses SSL (HTTPS). Check if request payloads contain credentials.',
      });

      // Check for unencrypted HTTP URL
      const url = params.url || '';
      if (typeof url === 'string' && url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
        findings.push({
          id: `sec-${scanId}-insecure-url-${nodeName}`,
          type: 'insecure_url',
          severity: 'medium',
          nodeName,
          nodeType,
          message: `Insecure HTTP URL detected: "${url}". Data is transmitted unencrypted over the network.`,
          recommendation: 'Upgrade the target endpoint URL protocol from http:// to https://.',
        });
      }
    }

    // 4. Detect Community nodes
    if (nodeType && !nodeType.startsWith('n8n-nodes-base.') && !nodeType.startsWith('@n8n/')) {
      findings.push({
        id: `sec-${scanId}-community-${nodeName}`,
        type: 'community',
        severity: 'low',
        nodeName,
        nodeType,
        message: `Community / Third-Party node type detected: "${nodeType}".`,
        recommendation: 'Verify that this community node package is installed from a trusted npm or GitHub repository source.',
      });
    }

    // 5. Detect Webhook Trigger nodes
    if (nodeType === 'n8n-nodes-base.webhook' || nodeType.includes('webhook')) {
      findings.push({
        id: `sec-${scanId}-webhook-${nodeName}`,
        type: 'webhook',
        severity: 'info',
        nodeName,
        nodeType,
        message: 'Webhook node exposes an endpoint listening for external incoming triggers.',
        recommendation: 'Review access rules. Ensure payload origin verification or header token protection is set up if triggers are sensitive.',
      });
    }

    // 6. Scan parameters for hardcoded secrets
    const scanParamsForSecrets = (obj: any, path: string) => {
      if (!obj) return;
      if (typeof obj === 'string') {
        for (const regex of secretRegexes) {
          if (regex.test(obj)) {
            const redacted = redactSecret(obj);
            findings.push({
              id: `sec-${scanId}-secret-${nodeName}-${path}`,
              type: 'secret',
              severity: 'high',
              nodeName,
              nodeType,
              message: `Suspected hardcoded credential, API key, or token detected in parameter value: "${redacted}".`,
              recommendation: 'Remove the plain text credential. Use n8n Credentials configurations or Environment Variables expression syntax instead.',
            });
            break;
          }
        }
      } else if (typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
          scanParamsForSecrets(obj[key], `${path}.${key}`);
        }
      }
    };

    if (node.parameters) {
      scanParamsForSecrets(node.parameters, 'parameters');
    }
  }

  // Calculate final status
  let status: SecurityStatusType = 'Passed';
  if (findings.some(f => f.severity === 'critical' || f.severity === 'high')) {
    status = 'Potential Risk';
  } else if (findings.length > 0) {
    status = 'Review Recommended';
  }

  return {
    id: scanId,
    workflowId,
    status,
    findings,
    scannedAt: new Date().toISOString(),
  };
}
