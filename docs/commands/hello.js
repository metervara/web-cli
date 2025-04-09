const helloCommand = {
  name: "hello",
  description: "Prints a friendly greeting.",
  usage: "hello",
  execute(args) {
    console.log("Hello, world! This is a custom command from the host project.");
  }
};

export default helloCommand;