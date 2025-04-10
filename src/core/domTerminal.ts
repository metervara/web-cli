import { CLI } from './cli.js';

type LogLevel = 'info' | 'error' | 'warning' | 'input';

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
      this.appendOutput(`> ${this.currentInput}`, "input");
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
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args: any[]) => {
      this.appendOutput(args.join(" "), "info");
      originalLog(...args);
    };

    console.warn = (...args: any[]) => {
      this.appendOutput("Warning: " + args.join(" "), "warning");
      originalWarn(...args);
    };

    console.error = (...args: any[]) => {
      this.appendOutput("Error: " + args.join(" "), "error");
      originalError(...args);
    };

    this.cli.execute(commandStr);

    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }

  public appendOutput(text: string, level: LogLevel): void {
    const outputSpan = document.createElement("span");
    outputSpan.className = `cli-output ${level}`;
    outputSpan.textContent = text;
    this.outputEl.appendChild(outputSpan);
  }
}
