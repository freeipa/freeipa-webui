import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I delete view {string}", (viewName: string) => {
  cy.ipa({
    command: "idview-del",
    name: viewName,
  });
});

Given("view {string} exists", (viewName: string) => {
  cy.ipa({
    command: "idview-add",
    name: viewName,
  });
});
