import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When("I click on the {string} button", (button: string) => {
  cy.dataCy(button).click();
});

Then("I should see the {string} button is disabled", (button: string) => {
  cy.dataCy(button).should("be.disabled");
});
