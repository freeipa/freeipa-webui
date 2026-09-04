import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("netgroup {string} exists", (groupName: string) => {
  cy.ipa({
    command: "netgroup-add",
    name: groupName,
  });
});

Given("I delete netgroup {string}", (groupName: string) => {
  cy.ipa({
    command: "netgroup-del",
    name: groupName,
  });
});
