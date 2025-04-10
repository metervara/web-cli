import { CLI } from './cli.js';
export declare class DomTerminal {
    private currentInput;
    private cli;
    private outputEl;
    private inputEl;
    constructor(cli: CLI, outputEl: HTMLElement, inputEl: HTMLElement);
    private handleKeyDown;
    private runCommand;
    appendOutput(text: string): void;
}
