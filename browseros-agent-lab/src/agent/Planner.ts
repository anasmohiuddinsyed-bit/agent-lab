import { AgentMessage, AgentStep, Tool } from "./types.js";

export class Planner {
  constructor(private tools: Tool[]) {}

  plan(messages: AgentMessage[]): AgentStep {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const goal = lastUser?.content ?? "No goal";

    if (goal.toLowerCase().includes("read") || goal.toLowerCase().includes("extract")) {
      const browser = this.tools.find((t) => t.schema.name === "browser_dom_action");
      if (browser) {
        return {
          thought: "User wants page content. I will read from main element.",
          toolName: browser.schema.name,
          toolArgs: { action: "read", selector: "main, body" }
        };
      }
    }

    if (goal.toLowerCase().includes("fetch") || goal.toLowerCase().includes("api")) {
      const http = this.tools.find((t) => t.schema.name === "http_fetch");
      if (http) {
        return {
          thought: "User wants to fetch external data.",
          toolName: http.schema.name,
          toolArgs: { url: "https://jsonplaceholder.typicode.com/todos/1" }
        };
      }
    }

    return {
      thought:
        "No direct tool match. I will explain what I can do and ask for a selector or URL.",
      toolName: undefined
    };
  }
}
