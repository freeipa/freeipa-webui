import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When("I click on the {string} tab", (tab: string) => {
  cy.dataCy(tab).click();
});

Then("I should not see {string} tab", (tab: string) => {
  cy.dataCy(tab).should("not.exist");
});

Then("I should see {string} tab", (tab: string) => {
  cy.dataCy(tab).should("exist");
  cy.dataCy(tab).should("be.visible");
});

Then("I should see {string} tab selected", (tab: string) => {
  cy.dataCy(tab).should("have.attr", "aria-selected", "true");
});
