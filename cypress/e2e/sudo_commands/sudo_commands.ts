import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("sudo command {string} exists", (cmdName: string) => {
  cy.ipa({
    command: "sudocmd-add",
    name: cmdName,
  });
});

Given("I delete sudo command {string}", (cmdName: string) => {
  cy.ipa({
    command: "sudocmd-del",
    name: cmdName,
  });
});
