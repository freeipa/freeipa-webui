const helloWorldPlugin = {
  id: "hello-world",
  name: "Hello World Plugin",
  version: "1.0.0",
  description: "A minimal example plugin that logs to the console.",
  register() {
    console.log("Hello World from a dynamically loaded plugin!");
  }
};
export {
  helloWorldPlugin as default
};
//# sourceMappingURL=plugin.js.map
