import { CLI } from './cli.js';
type LogLevel = 'info' | 'error' | 'warning' | 'input';
export declare class DomTerminal {
    private currentInput;
    private cli;
    outputEl: HTMLElement;
    private inputEl;
    private addLineBreakAfterOutput;
    private commandHistory;
    private commandHistoryIndex;
    config: {
        promptPrefix: string;
        errorPrefix: string;
        warningPrefix: string;
        infoPrefix: string;
        promptSuffix: string;
        errorSuffix: string;
        warningSuffix: string;
        infoSuffix: string;
        interceptKeyboardShortcuts: boolean;
        passthroughKeys: string[];
    };
    constructor(cli: CLI, outputEl: HTMLElement, inputEl: HTMLElement, addLineBreakAfterOutput?: boolean);
    private handleKeyDown;
    private runCommand;
    appendOutput(text: string, level: LogLevel): void;
}
export {};
