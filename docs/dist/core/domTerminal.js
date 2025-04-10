export class DomTerminal {
    constructor(cli, outputEl, inputEl) {
        this.currentInput = "";
        this.cli = cli;
        this.outputEl = outputEl;
        this.inputEl = inputEl;
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
    handleKeyDown(event) {
        if (event.key === "Enter") {
            this.appendOutput(`> ${this.currentInput}`, "input");
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
            this.appendOutput(args.join(" "), "info");
            originalLog(...args);
        };
        console.warn = (...args) => {
            this.appendOutput("Warning: " + args.join(" "), "warning");
            originalWarn(...args);
        };
        console.error = (...args) => {
            this.appendOutput("Error: " + args.join(" "), "error");
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
