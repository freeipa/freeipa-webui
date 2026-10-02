import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

Then("I should see {string} alert", (name: string) => {
  cy.dataCy(name).should("be.visible");
});

When("I close the {string} alert", (name: string) => {
  cy.dataCy(name)
    .should("be.visible")
    .find("[data-cy='alert-button-close']")
    .click();
  cy.dataCy(name).should("not.exist");
});
