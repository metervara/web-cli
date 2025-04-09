import { CLI } from "../src/cli.js";
import { DomTerminal } from "../src/domTerminal.js";
import openCommand from "../src/commands/open.js";
import { createHelpCommand } from "../src/commands/help.js";
import helloCommand from "./commands/hello.js";
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
}
else {
    console.error("Parent element for CLI not found.");
}
