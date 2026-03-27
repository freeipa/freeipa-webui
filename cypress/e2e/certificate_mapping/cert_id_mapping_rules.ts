import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("certmaprule {string} exists", (ruleName: string) => {
  cy.ipa({
    command: "certmaprule-add",
    name: ruleName,
  });
});

Given("certmaprule {string} exists and is disabled", (ruleName: string) => {
  cy.ipa({
    command: "certmaprule-add",
    name: ruleName,
  }).then(() => {
    cy.ipa({
      command: "certmaprule-disable",
      name: ruleName,
    });
  });
});

Given("I delete certmaprule {string}", (ruleName: string) => {
  cy.ipa({
    command: "certmaprule-del",
    name: ruleName,
  });
});
