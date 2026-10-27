import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I should not see {string} element", (element: string) => {
  cy.dataCy(element).should("not.exist");
});

Then("I should see {string} text on the page", (text: string) => {
  cy.contains(text).should("be.visible");
});
