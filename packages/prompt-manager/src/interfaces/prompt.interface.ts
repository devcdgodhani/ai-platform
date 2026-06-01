export interface PromptTemplate {
  name: string;
  version: string;
  description: string;
  system: string;
  userTemplate: string; // Supports {{variable}} interpolation
  variables: string[];  // Required variable names
}

export interface CompiledPrompt {
  system: string;
  user: string;
}
