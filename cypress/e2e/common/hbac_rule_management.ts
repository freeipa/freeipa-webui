import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("hbac rule {string} exists", (ruleName: string) => {
  cy.ipa({
    command: "hbacrule-add",
    name: ruleName,
  });
});

Given("I delete hbac rule {string}", (ruleName: string) => {
  cy.ipa({
    command: "hbacrule-del",
    name: ruleName,
  });
});
