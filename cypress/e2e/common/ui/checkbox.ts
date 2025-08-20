import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When("I click on the {string} checkbox", (checkbox: string) => {
  cy.dataCy(checkbox).click();
});

Then("I should see the {string} checkbox is checked", (checkbox: string) => {
  cy.dataCy(checkbox).should("be.checked");
});

Then("I should see the {string} checkbox is unchecked", (checkbox: string) => {
  cy.dataCy(checkbox).should("not.be.checked");
});
