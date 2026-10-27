import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

export const selectTypeAheadGroup = (fieldId: string, groupName: string) => {
  cy.dataCy(`${fieldId}-select-toggle`).click();
  cy.dataCy(`${fieldId}-select-toggle`)
    .find('[role="combobox"]')
    .should("have.attr", "aria-expanded", "true");
  cy.dataCy(`${fieldId}-select-${groupName}`).should("be.visible").click();
};

export const isTypeAheadGroupSelected = (
  fieldId: string,
  groupName: string
) => {
  cy.dataCy(`${fieldId}-select-toggle`)
    .find("input")
    .should("have.value", groupName);
};

When(
  "I select {string} in the {string} typeahead group",
  (groupName: string, fieldId: string) => {
    selectTypeAheadGroup(fieldId, groupName);
  }
);

Then(
  "I should see {string} in the {string} typeahead group",
  (groupName: string, fieldId: string) => {
    isTypeAheadGroupSelected(fieldId, groupName);
  }
);
