export class CLI {
    constructor() {
        this.commands = new Map();
    }
    // Register a single command
    registerCommand(command) {
        this.commands.set(command.name, command);
    }
    // Register multiple commands at once
    registerCommands(commands) {
        commands.forEach(cmd => this.registerCommand(cmd));
    }
    // Retrieve a command by name (used by help command)
    getCommand(name) {
        return this.commands.get(name);
    }
    // Get all registered commands (used by help command)
    getAllCommands() {
        return Array.from(this.commands.values());
    }
    // Execute a command given an input string (e.g. "open Home")
    execute(input) {
        const tokens = input.trim().split(/\s+/);
        if (tokens.length === 0)
            return;
        const commandName = tokens[0];
        const args = tokens.slice(1);
        const command = this.commands.get(commandName);
        if (!command) {
            console.error(`Command '${commandName}' not found. Type 'help' for available commands.`);
            return;
        }
        try {
            command.execute(args);
        }
        catch (error) {
            console.error(`Error executing command '${commandName}':`, error);
        }
    }
}
