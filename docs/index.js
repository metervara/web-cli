import { CLI } from "./dist/index.js";
import { DomTerminal } from "./dist/index.js";
import openCommand from "./dist/commands/open.js";
import { createHelpCommand } from "./dist/commands/help.js";
import helloCommand from "./commands/hello.js";

// Create a CLI instance and register commands
const cli = new CLI();
cli.registerCommand(openCommand);
cli.registerCommand(createHelpCommand(cli));
cli.registerCommand(helloCommand);

// Find the parent element in the DOM (ensure an element with id "cli-container" exists in your HTML)
const rootElement = document.getElementById("cli-container");
const inputElement = rootElement.querySelector(".cli-input");
const outputElement = rootElement.querySelector(".cli-output-wrapper");
if (inputElement && outputElement) {
  const terminal = new DomTerminal(cli, outputElement, inputElement);
  // Optionally print a welcome message
  terminal.appendOutput("Welcome to WebCLI. Type 'help' for a list of commands.");
} else {
  console.error("Parent element for CLI not found.");
}
