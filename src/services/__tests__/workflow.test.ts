import { describe, it, expect } from 'vitest';
import { parseWorkflow } from '../workflowParser';
import { normalizeWorkflow } from '../workflowNormalizer';
import { calculateWorkflowSimilarity, checkDuplicate } from '../duplicateDetector';
import { scanWorkflowSecurity } from '../securityScanner';
import { validateWorkflow } from '../workflowValidator';
import { generateWorkflowInstructions } from '../instructionGenerator';
import { calculateQualityScore } from '../workflowQualityScorer';
import { matchWorkflowLocal } from '../workflowMatcher';
import { generateWorkflowFromSpecification } from '../originalWorkflowGenerator';
import { calculateSemanticSimilarity, verifySemanticUniqueness } from '../semanticWorkflowUniqueness';
import { generateWorkflowSeo } from '../workflowSeoGenerator';
import { WorkflowSpecification } from '../../types/workflowSpecification';

const mockWorkflowJson = {
  name: "Gmail to Sheets Qualifier",
  nodes: [
    {
      id: "node-1",
      name: "Gmail Email Trigger",
      type: "n8n-nodes-base.gmailTrigger",
      typeVersion: 1,
      position: [100, 200]
    },
    {
      id: "node-2",
      name: "AI Prompt Analyzer",
      type: "@n8n/n8n-nodes-langchain.openAi",
      typeVersion: 1,
      position: [300, 200],
      parameters: {
        prompt: "Analyze this email contents: sk-proj-123456789abcdef123456789abcdef12345"
      }
    },
    {
      id: "node-3",
      name: "Save to Sheets",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 1,
      position: [500, 200]
    }
  ],
  connections: {
    "Gmail Email Trigger": {
      main: [
        [
          {
            node: "AI Prompt Analyzer",
            index: 0
          }
        ]
      ]
    },
    "AI Prompt Analyzer": {
      main: [
        [
          {
            node: "Save to Sheets",
            index: 0
          }
        ]
      ]
    }
  }
};

describe('FlowMatch AI Expanded Test Suite (36 Tests)', () => {
  
  // 1-8: Baseline tests (restored and verified)
  it('1. Workflow Parser extracts metadata correctly', () => {
    const parsed = parseWorkflow(mockWorkflowJson);
    expect(parsed.name).toBe("Gmail to Sheets Qualifier");
    expect(parsed.nodeCount).toBe(3);
    expect(parsed.integrations).toContain("Gmail");
    expect(parsed.integrations).toContain("OpenAI");
  });

  it('2. Normalizer strips position and metadata deterministically', () => {
    const norm = normalizeWorkflow(mockWorkflowJson);
    expect(norm.nodes[0]).not.toHaveProperty('position');
  });

  it('3. Duplicate Detector calculates structural similarity', () => {
    const w1 = {
      nodes: mockWorkflowJson.nodes,
      connections: mockWorkflowJson.connections,
      integrations: ["Gmail", "OpenAI", "Google Sheets"],
      triggerType: "Webhook"
    };
    const res = calculateWorkflowSimilarity(w1, w1);
    expect(res.score).toBe(100);
  });

  it('4. Security Scanner flags hardcoded secrets and redacts them', () => {
    const scan = scanWorkflowSecurity("test-id", mockWorkflowJson.nodes);
    expect(scan.status).toBe("Potential Risk");
    const secretFinding = scan.findings.find(f => f.type === 'secret');
    expect(secretFinding).toBeDefined();
    expect(secretFinding?.message).toContain('****REDACTED****');
  });

  it('5. Validator verifies node schema integrity', () => {
    const val = validateWorkflow("test-id", mockWorkflowJson);
    expect(val.status).toBe("Valid");
  });

  it('6. Instruction Generator builds step-by-step guidance', () => {
    const inst = generateWorkflowInstructions("Gmail to Sheets Qualifier", mockWorkflowJson.nodes as any);
    expect(inst.requiredAccounts).toContain("Gmail Account");
    expect(inst.requiredAccounts).toContain("Google Sheets Account");
  });

  it('7. Quality Scorer calculates structural ratings', () => {
    const scoreReport = calculateQualityScore("test-id", "Valid", "Passed", 3, true, true);
    expect(scoreReport.score).toBeGreaterThanOrEqual(60);
  });

  it('8. Matcher calculates prompt alignment percentage', () => {
    const w = {
      id: "test-id",
      name: "Gmail to Sheets Qualifier",
      slug: "gmail-to-sheets",
      description: "Qualify email leads using OpenAI and write to Sheets.",
      shortDescription: "Gmail Sheets OpenAI workflow.",
      originalWorkflowJson: mockWorkflowJson,
      normalizedWorkflowJson: mockWorkflowJson,
      nodeCount: 3,
      integrationCount: 3,
      difficulty: "Beginner" as const,
      estimatedSetupTime: "5 Mins",
      integrations: ["Gmail", "OpenAI", "Google Sheets"],
      securityStatus: "Passed" as const,
      verified: true,
      featured: true,
      downloadCount: 10,
      viewCount: 20,
      workflowOrigin: "third_party_import" as const,
      instructionStatus: "auto_generated",
      qualityScore: 90,
      validationStatus: "Valid" as const,
      provenanceStatus: "source_repository_indexed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const match = matchWorkflowLocal("I want to save gmail leads to google sheets using AI", w);
    expect(match).not.toBeNull();
    expect(match!.matchScore.total).toBeGreaterThanOrEqual(60);
  });

  // 9-18: Original Generation & Uniqueness tests
  it('9. Generator creates JSON from specification', () => {
    const spec: WorkflowSpecification = {
      id: 'spec-test-1',
      title: 'AI Lead qualification',
      slug: 'ai-lead-qualification',
      businessProblem: 'Qualify leads',
      targetUsers: 'Sales',
      category: 'AI Automation',
      subcategory: 'Intake',
      businessIndustry: 'Real Estate',
      triggerType: 'Webhook',
      triggerIntegration: 'Webhook',
      requiredIntegrations: ['OpenAI', 'Google Sheets'],
      workflowSteps: ['Ingest', 'Qualify', 'Save'],
      expectedOutput: 'Google sheet row',
      difficulty: 'Beginner',
      estimatedSetupTime: '5 Mins',
      keywords: ['ai'],
      securityConsiderations: 'none',
      customizationIdeas: ['none'],
      testScenario: 'send payload',
      architecturePattern: 'event_to_action'
    };
    const json = generateWorkflowFromSpecification(spec);
    expect(json.name).toBe('AI Lead qualification');
    expect(json.nodes.length).toBe(3);
    expect(json.connections['Webhook Trigger']).toBeDefined();
  });

  it('10. Semantic similarity detects overlapping details', () => {
    const spec1: WorkflowSpecification = {
      id: 'spec-1',
      title: 'Gmail Slack sync',
      slug: 'gmail-slack',
      businessProblem: 'Sync gmail messages to slack',
      targetUsers: 'Ops',
      category: 'Email',
      subcategory: 'Sync',
      businessIndustry: 'Tech',
      triggerType: 'Webhook',
      triggerIntegration: 'Webhook',
      requiredIntegrations: ['Gmail', 'Slack'],
      workflowSteps: ['Listen', 'Post'],
      expectedOutput: 'Slack channel post',
      difficulty: 'Beginner',
      estimatedSetupTime: '5 Mins',
      keywords: ['sync'],
      securityConsiderations: 'none',
      customizationIdeas: ['none'],
      testScenario: 'send payload',
      architecturePattern: 'event_to_action'
    };
    const similarity = calculateSemanticSimilarity(spec1, spec1);
    expect(similarity.score).toBe(100);
  });

  it('11. Deterministic node IDs are generated consistently', () => {
    const spec: WorkflowSpecification = {
      id: 'spec-2',
      title: 'Real Estate lead capture',
      slug: 'real-estate-lead-capture',
      businessProblem: 'Capture leads',
      targetUsers: 'Agents',
      category: 'Sales',
      subcategory: 'Capture',
      businessIndustry: 'Real Estate',
      triggerType: 'Manual',
      triggerIntegration: 'Manual Trigger',
      requiredIntegrations: ['Google Sheets'],
      workflowSteps: ['Trigger', 'Save'],
      expectedOutput: 'Sheet row',
      difficulty: 'Beginner',
      estimatedSetupTime: '5 Mins',
      keywords: ['re'],
      securityConsiderations: 'none',
      customizationIdeas: ['none'],
      testScenario: 'trigger',
      architecturePattern: 'event_to_action'
    };
    const json = generateWorkflowFromSpecification(spec);
    expect(json.nodes[0].id).toBe('realestateleadcapturetrig');
  });

  it('12. Safe placeholder configuration checks', () => {
    const node = {
      id: 'node-1',
      name: 'Sheets node',
      type: 'n8n-nodes-base.googleSheets',
      typeVersion: 1,
      position: [100, 100],
      parameters: {
        spreadsheetId: 'YOUR_SPREADSHEET_ID_PLACEHOLDER'
      }
    };
    const report = calculateQualityScore("test-id", "Valid", "Passed", 1, true, true, undefined, { nodes: [node] });
    // Check that we deducted points for placeholder but connection is valid
    expect(report.score).toBeLessThan(100);
  });

  it('13. SEO metadata is generated with primary keywords', () => {
    const w = {
      id: "test-id",
      name: "Slack Alert Sync",
      slug: "slack-alert",
      description: "description",
      shortDescription: "short",
      originalWorkflowJson: {},
      normalizedWorkflowJson: {},
      nodeCount: 2,
      integrationCount: 1,
      difficulty: "Beginner" as const,
      estimatedSetupTime: "5 Mins",
      integrations: ["Slack"],
      securityStatus: "Passed" as const,
      verified: true,
      featured: true,
      downloadCount: 1,
      viewCount: 1,
      workflowOrigin: "flowmatch_original" as const,
      instructionStatus: "flowmatch_original",
      qualityScore: 90,
      validationStatus: "Valid" as const,
      provenanceStatus: "flowmatch_authored",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const seo = generateWorkflowSeo(w);
    expect(seo.metaTitle).toContain("Slack Alert Sync");
    expect(seo.primaryKeyword).toBe("Slack Alert Sync n8n workflow");
  });

  // 14-36: Generate quick mocks to test 23 additional workflows from various categories
  const testCategories = [
    'AI Automation', 'Sales', 'Cybersecurity', 'Real Estate', 'Hotel Operations',
    'Restaurant Operations', 'Student Productivity', 'DevOps', 'Invoice Processing',
    'Developer Productivity', 'Lead Generation', 'Marketing', 'Social Media',
    'Email Automation', 'CRM', 'Customer Support', 'E-commerce', 'Finance',
    'Accounting', 'HR', 'Recruitment', 'SEO', 'WordPress'
  ];

  testCategories.forEach((category, idx) => {
    it(`${14 + idx}. Validate generated schema for category: ${category}`, () => {
      const spec: WorkflowSpecification = {
        id: `spec-cat-test-${idx}`,
        title: `${category} Automation Flow`,
        slug: `${category.toLowerCase().replace(/\s+/g, '-')}-automation-flow`,
        businessProblem: `Solve ${category} needs`,
        targetUsers: `Users in ${category}`,
        category,
        subcategory: `Test`,
        businessIndustry: `Tech`,
        triggerType: 'Manual',
        triggerIntegration: 'Manual Trigger',
        requiredIntegrations: ['Google Sheets'],
        workflowSteps: ['Trigger', 'Log'],
        expectedOutput: 'Log updated',
        difficulty: 'Beginner',
        estimatedSetupTime: '5 Mins',
        keywords: [category.toLowerCase()],
        securityConsiderations: 'none',
        customizationIdeas: ['none'],
        testScenario: 'manual test',
        architecturePattern: 'event_to_action'
      };
      
      const json = generateWorkflowFromSpecification(spec);
      const val = validateWorkflow(spec.id, json);
      expect(val.status === 'Valid' || val.status === 'Valid With Warnings').toBe(true);
    });
  });
});
