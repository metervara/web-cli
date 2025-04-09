export interface Command {
  name: string;
  description: string;
  usage: string;
  execute(args: string[]): void;
}

export class CLI {
  private commands: Map<string, Command> = new Map();

  // Register a single command
  registerCommand(command: Command): void {
    this.commands.set(command.name, command);
  }

  // Register multiple commands at once
  registerCommands(commands: Command[]): void {
    commands.forEach(cmd => this.registerCommand(cmd));
  }

  // Retrieve a command by name (used by help command)
  getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  // Get all registered commands (used by help command)
  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  // Execute a command given an input string (e.g. "open Home")
  execute(input: string): void {
    const tokens = input.trim().split(/\s+/);
    if (tokens.length === 0) return;

    const commandName = tokens[0];
    const args = tokens.slice(1);

    const command = this.commands.get(commandName);
    if (!command) {
      console.error(`Command '${commandName}' not found. Type 'help' for available commands.`);
      return;
    }
    try {
      command.execute(args);
    } catch (error) {
      console.error(`Error executing command '${commandName}':`, error);
    }
  }
}
