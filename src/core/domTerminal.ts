import { CLI } from './cli.js';

type LogLevel = 'info' | 'error' | 'warning' | 'input';

export class DomTerminal {
  private currentInput: string = "";
  private cli: CLI;
  private outputEl: HTMLElement;
  private inputEl: HTMLElement;

  private commandHistory: string[] = [];
  private commandHistoryIndex: number = 0; // points to next command (or past-the-end)

  public config: {
    promptPrefix: string;                 // Used before user input when pressing Enter.
    errorPrefix: string;                  // Prepend error messages.
    warningPrefix: string;                // Prepend warning messages.
    infoPrefix: string;                   // Prepend info messages
    promptSuffix: string;                 // Used before user input when pressing Enter.
    errorSuffix: string;                  // Append error messages.
    warningSuffix: string;                // Append warning messages.
    infoSuffix: string;                   // Append info messages
    interceptKeyboardShortcuts: boolean,  // If set to true, the CLI will block standard shortcust like CMD-R to reload and copy&paste etc. If true, consider handling that manually
  } = {
    promptPrefix: "> ",           
    errorPrefix: "Error: ",       
    warningPrefix: "Warning: ",   
    infoPrefix: "",               
    promptSuffix: "",             
    errorSuffix: "",              
    warningSuffix: "",            
    infoSuffix: "",               
    interceptKeyboardShortcuts: false
  };

  constructor(cli: CLI, outputEl: HTMLElement, inputEl: HTMLElement) {
    this.cli = cli;
    this.outputEl = outputEl;
    this.inputEl = inputEl;

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    
    // Determine if we intercept or pass through keyboard shortcuts
    if (!this.config.interceptKeyboardShortcuts && (event.metaKey || event.ctrlKey)) {
      return;
    }

    if (event.key === "Enter") {
      if (this.currentInput.trim() !== "") {
        this.commandHistory.push(this.currentInput);
        this.commandHistoryIndex = this.commandHistory.length;
      }
      this.appendOutput(this.config.promptPrefix + this.currentInput + this.config.promptSuffix, "input");
      this.runCommand(this.currentInput);
      this.currentInput = "";
      this.inputEl.textContent = "";
      event.preventDefault();
    } else if (event.key === "Backspace") {
      this.currentInput = this.currentInput.slice(0, -1);
      this.inputEl.textContent = this.currentInput;
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      if (this.commandHistory.length > 0) {
        this.commandHistoryIndex = Math.max(this.commandHistoryIndex - 1, 0);
        this.currentInput = this.commandHistory[this.commandHistoryIndex];
        this.inputEl.textContent = this.currentInput;
      }
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      if (this.commandHistory.length > 0) {
        this.commandHistoryIndex = Math.min(this.commandHistoryIndex + 1, this.commandHistory.length);
        if (this.commandHistoryIndex === this.commandHistory.length) {
          this.currentInput = "";
        } else {
          this.currentInput = this.commandHistory[this.commandHistoryIndex];
        }
        this.inputEl.textContent = this.currentInput;
      }
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
      this.appendOutput(this.config.infoPrefix + args.join(" ") + this.config.infoSuffix, "info");
      originalLog(...args);
    };

    console.warn = (...args: any[]) => {
      this.appendOutput(this.config.warningPrefix + args.join(" ") + this.config.warningSuffix, "warning");
      originalWarn(...args);
    };

    console.error = (...args: any[]) => {
      this.appendOutput(this.config.errorPrefix + args.join(" ") + this.config.errorSuffix, "error");
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
