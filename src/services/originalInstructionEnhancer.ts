import { WorkflowInstructions, WorkflowNode } from '../types/workflow';

export function enhanceOriginalInstructions(
  instructions: WorkflowInstructions,
  spec: {
    title: string;
    businessProblem: string;
    triggerIntegration: string;
    requiredIntegrations: string[];
    expectedOutput: string;
    testScenario: string;
    customizationIdeas: string[];
  },
  nodes: WorkflowNode[]
): WorkflowInstructions {
  // Enhanced Setup steps
  const setupInstructions = [
    `Download this FlowMatch AI original blueprint JSON file.`,
    `Open your n8n workspace dashboard and import the blueprint file directly onto the node canvas.`,
    ...instructions.setupInstructions.slice(2),
  ];

  // Specific configuration steps mapping
  const configurationSteps: string[] = [
    `Locate and open the trigger node "${spec.triggerIntegration}".`,
    ...spec.requiredIntegrations.map((integration) => {
      const node = nodes.find(n => n.type.toLowerCase().includes(integration.replace(/\s+/g, '').toLowerCase()));
      const nodeName = node ? node.name : `Save to ${integration}`;
      return `Open the action node "${nodeName}" and configure your ${integration} account credentials.`;
    }),
    `Map appropriate JSON expression fields between incoming trigger payload schemas and destination nodes.`
  ];

  // Customization scenarios
  const customizationIdeas = [
    ...spec.customizationIdeas,
    `Add an AI translation step to qualify multilingual inputs.`,
    `Add a Slack webhook node to trigger alert messages on process exceptions.`
  ];

  return {
    ...instructions,
    setupInstructions,
    configurationSteps,
    testingSteps: [
      `Initiate test execution using n8n's "Test step" mode.`,
      `Execute target test scenario: ${spec.testScenario}`,
      `Confirm that the green execution markers light up indicating data is mapped correctly.`
    ],
    expectedResult: spec.expectedOutput,
    customizationIdeas,
    troubleshooting: [
      `Check your credentials and API token authorizations if authorization failures block execution.`,
      `Ensure expressions reference correct upstream node output keys.`,
      `Review n8n execution histories logs for precise error stack traces.`
    ],
    securityNotes: [
      `Ensure that you select credentials stored in n8n's credential locker. Do not write API keys in plain text parameters.`,
      `Secure webhook ingestion endpoints using headers or secret token authorizations.`
    ]
  };
}
