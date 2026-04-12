import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I should see {string} modal", (modalName: string) => {
  cy.dataCy(modalName).should("exist");
});

Then("I should not see {string} modal", (modalName: string) => {
  cy.get(`[data-cy='${modalName}']`, { timeout: 30000 }).should("not.exist");
});
