import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I delete host {string}", (hostName: string) => {
  cy.ipa({
    command: "host-del",
    name: hostName,
  });
});

Given("host {string} exists", (hostName: string) => {
  cy.ipa({
    command: "host-add --force",
    name: hostName,
  });
});
