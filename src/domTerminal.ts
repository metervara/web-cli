import { CLI } from './cli';

export class DomTerminal {
  private currentInput: string = "";
  private cli: CLI;
  private root: HTMLElement;
  private inputLine: HTMLElement;
  private cursor: HTMLElement | undefined;

  constructor(cli: CLI, root: HTMLElement, inputLine: HTMLElement | undefined = undefined, addCursor: boolean = true) {
    this.cli = cli;
    this.root = root;

    if(inputLine) {
      this.inputLine = inputLine;
    } else {
      this.inputLine = document.createElement("span");
      this.inputLine.className = "cli-input";
      this.root.appendChild(this.inputLine);
    }

    if(addCursor) {
      this.cursor = document.createElement("span");
      this.cursor.innerText = "_";
      this.cursor.className = "cursor";
      this.root.appendChild(this.cursor);
    }

    // Listen for key events on the document
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.appendOutput(`> ${this.currentInput}`);
      this.runCommand(this.currentInput);
      this.currentInput = "";
      this.inputLine.textContent = "";
      event.preventDefault();
    } else if (event.key === "Backspace") {
      this.currentInput = this.currentInput.slice(0, -1);
      this.inputLine.textContent = this.currentInput;
      event.preventDefault();
    } else if (event.key.length === 1) {
      this.currentInput += event.key;
      this.inputLine.textContent = this.currentInput;
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
    this.root.insertBefore(outputSpan, this.inputLine);
    this.root.insertBefore(document.createElement("br"), this.inputLine);
  }
}
