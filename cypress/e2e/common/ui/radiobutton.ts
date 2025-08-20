import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When("I click on the {string} radio button", (radioButton: string) => {
  cy.dataCy(radioButton).click();
});

Then(
  "I should see the {string} radio button is selected",
  (radioButton: string) => {
    cy.dataCy(radioButton).should("be.checked");
  }
);

Then(
  "I should see the {string} radio button is not selected",
  (radioButton: string) => {
    cy.dataCy(radioButton).should("not.be.checked");
  }
);
