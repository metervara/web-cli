import { Command } from "../../src/cli.js"; 

const helloCommand: Command = {
  name: "hello",
  description: "Prints a friendly greeting.",
  usage: "hello",
  execute(args: string[]): void {
    console.log("Hello, world! This is a custom command from the host project.");
  }
};

export default helloCommand;