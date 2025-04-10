export class DomTerminal {
    constructor(cli, outputEl, inputEl) {
        this.currentInput = "";
        this.config = {
            promptPrefix: "> ",
            errorPrefix: "Error: ",
            warningPrefix: "Warning: ",
            infoPrefix: "",
            promptSuffix: "",
            errorSuffix: "",
            warningSuffix: "",
            infoSuffix: "" // Append info messages
        };
        this.cli = cli;
        this.outputEl = outputEl;
        this.inputEl = inputEl;
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
    handleKeyDown(event) {
        if (event.key === "Enter") {
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
    }
}
