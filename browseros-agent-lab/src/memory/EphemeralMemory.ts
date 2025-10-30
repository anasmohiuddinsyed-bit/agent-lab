export class EphemeralMemory {
  private items: string[] = [];
  private max = 10;

  add(text: string) {
    this.items.unshift(text);
    if (this.items.length > this.max) {
      this.items.pop();
    }
  }

  toContext(): string {
    if (this.items.length === 0) return "";
    return `Recent observations:\n${this.items.map((x, i) => `${i + 1}. ${x}`).join("\n")}`;
  }
}
