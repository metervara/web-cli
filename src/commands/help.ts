import { Command, CLI } from "../index.js";

export function createHelpCommand(cli: CLI): Command {
  return {
    name: "help",
    description: "Displays help information for available commands",
    usage: "help [commandName]",
    execute(args: string[]): void {
      if (args.length > 0) {
        const cmd = cli.getCommand(args[0]);
        if (cmd) {
          console.log(`Command: ${cmd.name}`);
          console.log(`Description: ${cmd.description}`);
          console.log(`Usage: ${cmd.usage}`);
        } else {
          console.error(`Command '${args[0]}' not found.`);
        }
      } else {
        console.log("Available commands:");
        cli.getAllCommands().forEach(cmd => {
          console.log(`\n${cmd.name} - ${cmd.description}`);
          console.log(`Usage: ${cmd.usage}`);
        });
      }
    }
  };
}
