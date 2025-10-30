export type AgentMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string }
  | { role: "tool"; name: string; content: string };

export type ToolParam = {
  name: string;
  description: string;
  required?: boolean;
};

export type ToolSchema = {
  name: string;
  description: string;
  params?: ToolParam[];
};

export interface Tool {
  schema: ToolSchema;
  run(args: Record<string, unknown>): Promise<string>;
}

export type AgentStep = {
  thought: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  observation?: string;
};

export type AgentConfig = {
  name: string;
  tools: Tool[];
  maxSteps?: number;
};
