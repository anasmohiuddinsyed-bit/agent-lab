import { Tool, ToolSchema } from "../agent/types.js";

export class BrowserTool implements Tool {
  schema: ToolSchema = {
    name: "browser_dom_action",
    description:
      "Interact with the current page. Supports read, click, type. Must specify action and selector.",
    params: [
      { name: "action", description: "one of: read, click, type", required: true },
      { name: "selector", description: "CSS selector to target", required: true },
      { name: "text", description: "text to type if action=type", required: false }
    ]
  };

  constructor(private dom?: Document) {}

  async run(args: Record<string, unknown>): Promise<string> {
    const action = String(args["action"] ?? "");
    const selector = String(args["selector"] ?? "");

    if (typeof document === "undefined" && !this.dom) {
      return `[simulated ${action} on ${selector}]`;
    }

    const d = this.dom ?? document;
    const el = d.querySelector(selector);
    if (!el) {
      return `Element ${selector} not found`;
    }

    switch (action) {
      case "read":
        return el.textContent?.trim() ?? "";
      case "click":
        (el as HTMLElement).click?.();
        return `Clicked ${selector}`;
      case "type": {
        const text = String(args["text"] ?? "");
        (el as HTMLInputElement).value = text;
        (el as HTMLInputElement).dispatchEvent(new Event("input", { bubbles: true }));
        return `Typed into ${selector}: ${text}`;
      }
      default:
        return `Unknown action: ${action}`;
    }
  }
}
