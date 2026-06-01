import type { AgentStatus, AgentStep } from '@ai-platform/shared-types';
import { MessageRole } from '@ai-platform/shared-types';

/**
 * AgentState is the shared state object threaded through all LangGraph nodes.
 * Annotated with reducers so LangGraph knows how to merge state updates.
 */
export interface AgentState {
  sessionId: string;
  userId: string;
  status: AgentStatus;
  messages: Array<{ role: MessageRole; content: string }>;
  steps: AgentStep[];
  context: Record<string, unknown>;
  iteration: number;
  maxIterations: number;
  error?: string;
  output?: string;
}

/** State annotation for LangGraph — messages append, steps append, rest replace */
export const agentStateAnnotation = {
  sessionId: { reducer: (_: string, next: string) => next },
  userId: { reducer: (_: string, next: string) => next },
  status: { reducer: (_: AgentStatus, next: AgentStatus) => next },
  messages: {
    reducer: (
      current: AgentState['messages'],
      next: AgentState['messages'],
    ) => [...current, ...next],
  },
  steps: {
    reducer: (current: AgentStep[], next: AgentStep[]) => [...current, ...next],
  },
  context: {
    reducer: (
      current: Record<string, unknown>,
      next: Record<string, unknown>,
    ) => ({ ...current, ...next }),
  },
  iteration: { reducer: (_: number, next: number) => next },
  maxIterations: { reducer: (_: number, next: number) => next },
  error: { reducer: (_: string | undefined, next: string | undefined) => next },
  output: { reducer: (_: string | undefined, next: string | undefined) => next },
};
