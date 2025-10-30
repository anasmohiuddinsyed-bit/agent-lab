import { AgentConfig, AgentMessage, AgentStep, Tool } from "./types.js";
import { EphemeralMemory } from "../memory/EphemeralMemory.js";
import { Planner } from "./Planner.js";

export class Agent {
  private messages: AgentMessage[] = [];
  private memory = new EphemeralMemory();
  private planner: Planner;

  constructor(private config: AgentConfig) {
    this.planner = new Planner(config.tools);
    this.messages.push({
      role: "system",
      content: `You are ${config.name}, a browser-native agent. You think in actions.`
    });
  }

  async run(goal: string): Promise<AgentStep[]> {
    this.messages.push({ role: "user", content: goal });
    const steps: AgentStep[] = [];
    const max = this.config.maxSteps ?? 4;

    for (let i = 0; i < max; i++) {
      const plan = this.planner.plan(this.messages);
      if (!plan.toolName) {
        const explanation =
          "I can: " +
          this.config.tools
            .map((t) => t.schema.name + ": " + t.schema.description)
            .join(" | ");
        this.messages.push({ role: "assistant", content: explanation });
        steps.push({ thought: plan.thought, observation: explanation });
        break;
      }

      const tool = this.config.tools.find((t) => t.schema.name === plan.toolName) as Tool;
      const obs = await tool.run(plan.toolArgs ?? {});
      this.memory.add(obs);
      const observationWithMem = obs + "\n" + this.memory.toContext();
      this.messages.push({
        role: "tool",
        name: plan.toolName,
        content: observationWithMem
      });
      steps.push({ ...plan, observation: observationWithMem });
    }

    return steps;
  }
}
