import { Tool, ToolSchema } from "../agent/types.js";

export class HttpTool implements Tool {
  schema: ToolSchema = {
    name: "http_fetch",
    description: "Fetch JSON from a URL (GET). Returns first 500 chars.",
    params: [{ name: "url", description: "URL to fetch", required: true }]
  };

  async run(args: Record<string, unknown>): Promise<string> {
    const url = String(args["url"] ?? "");
    const res = await fetch(url);
    const text = await res.text();
    return text.slice(0, 500);
  }
}
