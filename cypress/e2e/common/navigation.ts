import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

export const navigateTo = (handle: string) => {
  cy.visit(Cypress.env("BASE_URL") + "/" + handle);
  cy.location("pathname").should("match", new RegExp(`.*${handle}$`));
};

Given("I am on {string} page", (handle: string) => {
  navigateTo(handle);
});

When("I navigate to {string} page", (handle: string) => {
  cy.visit(Cypress.env("BASE_URL") + "/" + handle);
});

Then("I should be on {string} page", (handle: string) => {
  cy.location("pathname").should("match", new RegExp(`.*${handle}$`));
});
