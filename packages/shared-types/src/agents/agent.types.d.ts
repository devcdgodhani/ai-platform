export declare enum AgentStatus {
    IDLE = "idle",
    RUNNING = "running",
    PAUSED = "paused",
    COMPLETED = "completed",
    FAILED = "failed"
}
export interface AgentConfig {
    name: string;
    description: string;
    provider: string;
    model: string;
    maxIterations: number;
    tools: string[];
}
export interface AgentState {
    sessionId: string;
    status: AgentStatus;
    messages: import('./provider.types').AIMessage[];
    steps: AgentStep[];
    context: Record<string, unknown>;
    iteration: number;
    error?: string;
}
export interface AgentStep {
    id: string;
    type: 'llm' | 'tool' | 'retriever' | 'human';
    input: unknown;
    output: unknown;
    startedAt: Date;
    completedAt?: Date;
    error?: string;
}
export interface WorkflowDefinition {
    id: string;
    name: string;
    description: string;
    nodes: string[];
    edges: WorkflowEdge[];
    entrypoint: string;
}
export interface WorkflowEdge {
    from: string;
    to: string;
    condition?: string;
}
export interface ToolDefinition {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}
export interface ToolCall {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
}
export interface ToolResult {
    id: string;
    name: string;
    content: string;
    error?: string;
}
//# sourceMappingURL=agent.types.d.ts.map