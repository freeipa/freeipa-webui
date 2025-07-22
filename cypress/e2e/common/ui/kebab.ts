import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When("I click on the {string} kebab menu", (kebab: string) => {
  cy.dataCy(kebab).click();
});

Then("I should see {string} kebab menu expanded", (kebab: string) => {
  cy.dataCy(kebab).should("have.attr", "aria-expanded", "true");
});

Then("I should see {string} kebab menu collapsed", (kebab: string) => {
  cy.dataCy(kebab).should("have.attr", "aria-expanded", "false");
});
