export interface WorkflowSpecification {
  id: string;
  title: string;
  slug: string;
  businessProblem: string;
  targetUsers: string;
  category: string;
  subcategory: string;
  businessIndustry: string;
  triggerType: 'Webhook' | 'Scheduled' | 'Manual';
  triggerIntegration: string;
  requiredIntegrations: string[];
  optionalIntegrations?: string[];
  workflowSteps: string[];
  expectedOutput: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedSetupTime: string;
  keywords: string[];
  securityConsiderations: string;
  customizationIdeas: string[];
  testScenario: string;
  architecturePattern: string;
}
