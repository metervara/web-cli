export class DomTerminal {
    constructor(cli, outputEl, inputEl, addLineBreakAfterOutput = false) {
        this.currentInput = "";
        this.commandHistory = [];
        this.commandHistoryIndex = 0; // points to next command (or past-the-end)
        this.config = {
            promptPrefix: "> ",
            errorPrefix: "Error: ",
            warningPrefix: "Warning: ",
            infoPrefix: "",
            promptSuffix: "",
            errorSuffix: "",
            warningSuffix: "",
            infoSuffix: "",
            interceptKeyboardShortcuts: false,
            passthroughKeys: ["Escape"]
        };
        this.cli = cli;
        this.outputEl = outputEl;
        this.inputEl = inputEl;
        this.addLineBreakAfterOutput = addLineBreakAfterOutput;
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
    handleKeyDown(event) {
        // Determine if we intercept or pass through keyboard shortcuts
        if (!this.config.interceptKeyboardShortcuts && (event.metaKey || event.ctrlKey || this.config.passthroughKeys.includes(event.key))) {
            return;
        }
        if (event.key === "Enter") {
            if (this.currentInput.trim() !== "") {
                this.commandHistory.push(this.currentInput);
                this.commandHistoryIndex = this.commandHistory.length;
            }
            this.appendOutput(this.config.promptPrefix + this.currentInput + this.config.promptSuffix, "input");
            this.runCommand(this.currentInput);
            this.currentInput = "";
            this.inputEl.textContent = "";
            event.preventDefault();
        }
        else if (event.key === "Backspace") {
            this.currentInput = this.currentInput.slice(0, -1);
            this.inputEl.textContent = this.currentInput;
            event.preventDefault();
        }
        else if (event.key === "ArrowUp") {
            if (this.commandHistory.length > 0) {
                this.commandHistoryIndex = Math.max(this.commandHistoryIndex - 1, 0);
                this.currentInput = this.commandHistory[this.commandHistoryIndex];
                this.inputEl.textContent = this.currentInput;
            }
            event.preventDefault();
        }
        else if (event.key === "ArrowDown") {
            if (this.commandHistory.length > 0) {
                this.commandHistoryIndex = Math.min(this.commandHistoryIndex + 1, this.commandHistory.length);
                if (this.commandHistoryIndex === this.commandHistory.length) {
                    this.currentInput = "";
                }
                else {
                    this.currentInput = this.commandHistory[this.commandHistoryIndex];
                }
                this.inputEl.textContent = this.currentInput;
            }
            event.preventDefault();
        }
        else if (event.key.length === 1) {
            this.currentInput += event.key;
            this.inputEl.textContent = this.currentInput;
            event.preventDefault();
        }
    }
    runCommand(commandStr) {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        console.log = (...args) => {
            this.appendOutput(this.config.infoPrefix + args.join(" ") + this.config.infoSuffix, "info");
            originalLog(...args);
        };
        console.warn = (...args) => {
            this.appendOutput(this.config.warningPrefix + args.join(" ") + this.config.warningSuffix, "warning");
            originalWarn(...args);
        };
        console.error = (...args) => {
            this.appendOutput(this.config.errorPrefix + args.join(" ") + this.config.errorSuffix, "error");
            originalError(...args);
        };
        this.cli.execute(commandStr);
        console.log = originalLog;
        console.warn = originalWarn;
        console.error = originalError;
    }
    appendOutput(text, level) {
        const outputSpan = document.createElement("span");
        outputSpan.className = `cli-output ${level}`;
        outputSpan.textContent = text;
        this.outputEl.appendChild(outputSpan);
        if (this.addLineBreakAfterOutput) {
            this.outputEl.appendChild(document.createElement("br"));
        }
    }
}
