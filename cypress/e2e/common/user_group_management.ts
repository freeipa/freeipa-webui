import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("user group {string} exists", (groupName: string) => {
  cy.ipa({
    command: "group-add",
    name: groupName,
  });
});

Given("I delete user group {string}", (groupName: string) => {
  cy.ipa({
    command: "group-del",
    name: groupName,
  });
});
