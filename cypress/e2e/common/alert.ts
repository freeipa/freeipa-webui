import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I should see {string} alert", (name: string) => {
  cy.dataCy(name).should("be.visible");
});
