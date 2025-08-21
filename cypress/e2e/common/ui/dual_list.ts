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
  cy.dataCy("dual-list-left").find(`[data-cy='${item}']`).should("exist");
});

Then("I should see {string} dual list item on the right", (item: string) => {
  cy.dataCy("dual-list-right").find(`[data-cy='${item}']`).should("exist");
});

export const addItemToRightList = (item: string) => {
  const dualListItem = `item-${item}`;
  cy.dataCy("dual-list-search-link").click();
  cy.dataCy(dualListItem).should("exist");

  cy.dataCy(dualListItem).click();
  cy.dataCy(dualListItem).should("have.attr", "aria-selected", "true");

  cy.dataCy("dual-list-add-selected").click();
  cy.dataCy("dual-list-right")
    .find(`[data-cy='${dualListItem}']`)
    .should("exist");
  cy.dataCy(dualListItem).should("have.attr", "aria-selected", "false");
};
