import { When } from "@badeball/cypress-cucumber-preprocessor";

export const selectTypeAheadGroup = (fieldId: string, groupName: string) => {
  cy.dataCy(`${fieldId}-select-toggle`).click();
  cy.dataCy(`${fieldId}-select-toggle`)
    .find('[role="combobox"]')
    .should("have.attr", "aria-expanded", "true");
  cy.dataCy(`${fieldId}-select-${groupName}`).should("be.visible").click();
};

export const selectTypeAheadCheckbox = (dataCy: string, option: string) => {
  cy.dataCy(`${dataCy}-multi-typeahead-checkbox-menu-toggle`).click();
  cy.dataCy(`${dataCy}-${option}`).should("be.visible").click();
};

When(
  "I select {string} in the {string} typeahead group",
  (groupName: string, fieldId: string) => {
    selectTypeAheadGroup(fieldId, groupName);
  }
);

When(
  "I select {string} in the {string} typeahead checkbox",
  (option: string, dataCy: string) => {
    selectTypeAheadCheckbox(dataCy, option);
  }
);
