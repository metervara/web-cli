export class DomTerminal {
    // private cursor: HTMLElement;
    constructor(cli, outputEl, inputEl) {
        this.currentInput = "";
        this.cli = cli;
        // this.root = root;
        this.outputEl = outputEl;
        this.inputEl = inputEl;
        // if(inputEl) {
        //   this.inputEl = inputEl;
        // } else {
        //   this.inputEl = document.createElement("span");
        //   this.inputEl.className = "cli-input";
        //   this.outputEl.appendChild(this.inputEl);
        // }
        // if(addCursor) {
        //   this.cursor = document.createElement("span");
        //   this.cursor.innerText = "_";
        //   this.cursor.className = "cursor";
        //   this.outputEl.appendChild(this.cursor);
        // }
        // Listen for key events on the document
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
    handleKeyDown(event) {
        if (event.key === "Enter") {
            this.appendOutput(`> ${this.currentInput}`);
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
        this.outputEl.appendChild(outputSpan);
        // this.outputEl.appendChild(document.createElement("br")); // Leave this for consumer to decide how layout is done
    }
}
