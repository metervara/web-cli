import { CLI } from "../src/cli.js";
import openCommand from "../src/commands/open.js";
import { createHelpCommand } from "../src/commands/help.js";
import helloCommand from "./commands/hello.js";

// A simple DOM terminal that listens for key events and displays both input and output
class DomTerminal {
  private cli: CLI;
  private parent: HTMLElement;
  private inputLine: HTMLSpanElement;
  private cursor: HTMLSpanElement;
  private currentInput: string = "";

  constructor(cli: CLI, parent: HTMLElement) {
    this.cli = cli;
    this.parent = parent;
    // Create an element to display the current input text
    this.inputLine = document.createElement("span");
    this.inputLine.className = "cli-input";
    this.parent.appendChild(this.inputLine);

    this.cursor = document.createElement("span");
    this.cursor.innerText = "_";
    this.cursor.className = "cursor";
    this.parent.appendChild(this.cursor);

    // Listen for key events on the document
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // For simplicity, capture keys regardless of focus.
    if (event.key === "Enter") {
      // Display the entered command
      this.appendOutput(`> ${this.currentInput}`);
      // Run the command with CLI output redirected to the DOM
      this.runCommand(this.currentInput);
      // Clear the input for the next command
      this.currentInput = "";
      this.inputLine.textContent = "";
      event.preventDefault();
    } else if (event.key === "Backspace") {
      this.currentInput = this.currentInput.slice(0, -1);
      this.inputLine.textContent = this.currentInput;
      event.preventDefault();
    } else if (event.key.length === 1) {
      // Append printable characters to the current input
      this.currentInput += event.key;
      this.inputLine.textContent = this.currentInput;
      event.preventDefault();
    }
  }

  private runCommand(commandStr: string): void {
    // Temporarily override console.log and console.error so that CLI output is captured in the terminal.
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

    // Restore original console methods
    console.log = originalLog;
    console.error = originalError;
  }

  public appendOutput(text: string): void {
    const outputSpan = document.createElement("span");
    outputSpan.className = "cli-output";
    outputSpan.textContent = text;
    // Append the output span and add a line break for readability
    
    this.parent.insertBefore(outputSpan, this.inputLine);
    this.parent.insertBefore(document.createElement("br"), this.inputLine);
  }
}

// Create a CLI instance and register commands
const cli = new CLI();
cli.registerCommand(openCommand);
cli.registerCommand(createHelpCommand(cli));
cli.registerCommand(helloCommand);

// Find the parent element in the DOM (ensure an element with id "cli-container" exists in your HTML)
const parentElement = document.getElementById("cli-container");
if (parentElement) {
  const terminal = new DomTerminal(cli, parentElement);
  // Optionally print a welcome message
  terminal.appendOutput("Welcome to WebCLI. Type 'help' for a list of commands.");
} else {
  console.error("Parent element for CLI not found.");
}
