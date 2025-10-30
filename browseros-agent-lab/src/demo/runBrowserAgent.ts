import { Agent } from "../agent/Agent.js";
import { BrowserTool } from "../tools/BrowserTool.js";
import { HttpTool } from "../tools/HttpTool.js";

async function main() {
  const agent = new Agent({
    name: "BrowserOS Proto Agent",
    tools: [new BrowserTool(), new HttpTool()],
    maxSteps: 3
  });

  const steps = await agent.run("Read the main content of this page and summarize it.");
  console.log("AGENT TRACE:");
  for (const [i, step] of steps.entries()) {
    console.log(`Step ${i + 1}`);
    console.log("Thought:", step.thought);
    if (step.toolName) console.log("Tool:", step.toolName, step.toolArgs);
    console.log("Observation:", (step.observation ?? "").slice(0, 200) + "...");
    console.log("----");
  }
}

main().catch(console.error);
