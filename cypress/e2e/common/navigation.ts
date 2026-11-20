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

Then("I should see the page heading {string}", (heading: string) => {
  const [preText, ...nameParts] = heading.split(": ");
  const name = nameParts.join(": ");
  cy.get("h1").within(() => {
    cy.contains(preText + ":").should("be.visible");
    cy.contains(name).should("be.visible");
  });
});

When("I click on the {string} breadcrumb link", (linkText: string) => {
  cy.get(".pf-v6-c-breadcrumb__link").contains(linkText).click();
});
