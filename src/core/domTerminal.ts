import { CLI } from './cli.js';

export class DomTerminal {
  private currentInput: string = "";
  private cli: CLI;
  private outputEl: HTMLElement;
  private inputEl: HTMLElement;

  constructor(cli: CLI, outputEl: HTMLElement, inputEl: HTMLElement) {
    this.cli = cli;
    this.outputEl = outputEl;
    this.inputEl = inputEl;

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.appendOutput(`> ${this.currentInput}`);
      this.runCommand(this.currentInput);
      this.currentInput = "";
      this.inputEl.textContent = "";
      event.preventDefault();
    } else if (event.key === "Backspace") {
      this.currentInput = this.currentInput.slice(0, -1);
      this.inputEl.textContent = this.currentInput;
      event.preventDefault();
    } else if (event.key.length === 1) {
      this.currentInput += event.key;
      this.inputEl.textContent = this.currentInput;
      event.preventDefault();
    }
  }

  private runCommand(commandStr: string): void {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args: any[]) => {
      this.appendOutput(args.join(" "));
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      this.appendOutput("Error: " + args.join(" "));
      originalError(...args);
    };

    this.cli.execute(commandStr);

    console.log = originalLog;
    console.error = originalError;
  }

  public appendOutput(text: string): void {
    const outputSpan = document.createElement("span");
    outputSpan.className = "cli-output";
    outputSpan.textContent = text;
    this.outputEl.appendChild(outputSpan);
  }
}
