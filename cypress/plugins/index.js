const cucumber = require("cypress-cucumber-preprocessor").default;
const { verifyDownloadTasks } = require("cy-verify-downloads");

module.exports = (on) => {
  on("file:preprocessor", cucumber());
  on("task", verifyDownloadTasks);
};
