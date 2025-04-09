export interface Command {
    name: string;
    description: string;
    usage: string;
    execute(args: string[]): void;
}
export declare class CLI {
    private commands;
    registerCommand(command: Command): void;
    registerCommands(commands: Command[]): void;
    getCommand(name: string): Command | undefined;
    getAllCommands(): Command[];
    execute(input: string): void;
}
