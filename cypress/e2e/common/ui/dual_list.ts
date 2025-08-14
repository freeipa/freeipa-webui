import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When("I click on search link in dual list", () => {
  cy.dataCy("dual-list-search-link").click();
});

When("I click on {string} dual list item", (item: string) => {
  cy.dataCy(item).click();
});

Then("I should see {string} dual list item", (item: string) => {
  cy.dataCy(item).should("exist");
});

Then("I should see {string} dual list item selected", (item: string) => {
  cy.dataCy(item).should("have.attr", "aria-selected", "true");
});

Then("I should see {string} dual list item not selected", (item: string) => {
  cy.dataCy(item).should("have.attr", "aria-selected", "false");
});

Then("I should see {string} dual list item on the left", (item: string) => {
  cy.get("[data-cy=dual-list-left]").get(`[data-cy='${item}']`).should("exist");
});

Then("I should see {string} dual list item on the right", (item: string) => {
  cy.get("[data-cy=dual-list-right]")
    .get(`[data-cy='${item}']`)
    .should("exist");
});
