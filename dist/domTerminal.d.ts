import { CLI } from './cli';
export declare class DomTerminal {
    private currentInput;
    private cli;
    private root;
    private inputLine;
    private cursor;
    constructor(cli: CLI, root: HTMLElement, inputLine?: HTMLElement | undefined, addCursor?: boolean);
    private handleKeyDown;
    private runCommand;
    appendOutput(text: string): void;
}
