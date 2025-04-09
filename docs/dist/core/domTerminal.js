export class DomTerminal {
    constructor(cli, root, inputLine = undefined, addCursor = true) {
        this.currentInput = "";
        this.cli = cli;
        this.root = root;
        if (inputLine) {
            this.inputLine = inputLine;
        }
        else {
            this.inputLine = document.createElement("span");
            this.inputLine.className = "cli-input";
            this.root.appendChild(this.inputLine);
        }
        if (addCursor) {
            this.cursor = document.createElement("span");
            this.cursor.innerText = "_";
            this.cursor.className = "cursor";
            this.root.appendChild(this.cursor);
        }
        // Listen for key events on the document
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
    handleKeyDown(event) {
        if (event.key === "Enter") {
            this.appendOutput(`> ${this.currentInput}`);
            this.runCommand(this.currentInput);
            this.currentInput = "";
            this.inputLine.textContent = "";
            event.preventDefault();
        }
        else if (event.key === "Backspace") {
            this.currentInput = this.currentInput.slice(0, -1);
            this.inputLine.textContent = this.currentInput;
            event.preventDefault();
        }
        else if (event.key.length === 1) {
            this.currentInput += event.key;
            this.inputLine.textContent = this.currentInput;
            event.preventDefault();
        }
    }
    runCommand(commandStr) {
        const originalLog = console.log;
        const originalError = console.error;
        console.log = (...args) => {
            this.appendOutput(args.join(" "));
            originalLog(...args);
        };
        console.error = (...args) => {
            this.appendOutput("Error: " + args.join(" "));
            originalError(...args);
        };
        this.cli.execute(commandStr);
        console.log = originalLog;
        console.error = originalError;
    }
    appendOutput(text) {
        const outputSpan = document.createElement("span");
        outputSpan.className = "cli-output";
        outputSpan.textContent = text;
        this.root.insertBefore(outputSpan, this.inputLine);
        this.root.insertBefore(document.createElement("br"), this.inputLine);
    }
}
