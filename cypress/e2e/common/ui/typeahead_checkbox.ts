import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

const typeaheadCheckboxToggle = (dataCy: string) =>
  cy.get(`[data-cy='${dataCy}-multi-typeahead-checkbox-menu-toggle']`);

const typeaheadCheckboxInput = (dataCy: string) =>
  typeaheadCheckboxToggle(dataCy).find("input");

const typeaheadCheckboxOption = (option: string, dataCy: string) => {
  const selectors = [
    `[data-cy='${dataCy}-${option}']`,
    `[data-cy='${dataCy}-${option}-create-new-option']`,
  ];

  // Self-service attribute options still use the legacy select-attrs-* data-cy.
  if (dataCy.endsWith("select-attrs")) {
    selectors.push(`[data-cy='select-attrs-${option}']`);
  }

  return cy
    .dataCy(`${dataCy}-multi-typeahead-checkbox-select`)
    .find(selectors.join(", "))
    .first();
};

const clearTypeaheadCheckboxFilter = (dataCy: string) => {
  typeaheadCheckboxInput(dataCy).clear();
  typeaheadCheckboxInput(dataCy).should("have.value", "");
};

export const openTypeaheadCheckboxMenu = (dataCy: string) => {
  typeaheadCheckboxToggle(dataCy).find('[role="combobox"]').click();
  typeaheadCheckboxToggle(dataCy)
    .find('[role="combobox"]')
    .should("have.attr", "aria-expanded", "true");
};

export const closeTypeaheadCheckboxMenu = (dataCy: string) => {
  typeaheadCheckboxToggle(dataCy).click();
  typeaheadCheckboxToggle(dataCy)
    .find('[role="combobox"]')
    .should("have.attr", "aria-expanded", "false");
};

export const selectTypeaheadCheckboxOption = (
  option: string,
  dataCy: string
) => {
  openTypeaheadCheckboxMenu(dataCy);
  clearTypeaheadCheckboxFilter(dataCy);
  typeaheadCheckboxOption(option, dataCy).scrollIntoView();
  typeaheadCheckboxOption(option, dataCy).click();
  closeTypeaheadCheckboxMenu(dataCy);
};

export const createTypeaheadCheckboxOption = (
  option: string,
  dataCy: string
) => {
  openTypeaheadCheckboxMenu(dataCy);
  typeaheadCheckboxInput(dataCy).clear().type(option);
  cy.dataCy(`${dataCy}-create-new-option`).should("be.visible").click();
  closeTypeaheadCheckboxMenu(dataCy);
};

export const isTypeaheadCheckboxOptionSelected = (
  option: string,
  dataCy: string
) => {
  openTypeaheadCheckboxMenu(dataCy);
  clearTypeaheadCheckboxFilter(dataCy);
  typeaheadCheckboxOption(option, dataCy)
    .should("exist")
    .find('input[type="checkbox"]')
    .should("be.checked");
  closeTypeaheadCheckboxMenu(dataCy);
};

When(
  "I select {string} in the {string} typeahead checkbox",
  (option: string, dataCy: string) => {
    selectTypeaheadCheckboxOption(option, dataCy);
  }
);

When(
  "I create {string} in the {string} typeahead checkbox",
  (option: string, dataCy: string) => {
    createTypeaheadCheckboxOption(option, dataCy);
  }
);

Then(
  "I should see the {string} option selected in the {string} typeahead checkbox",
  (option: string, dataCy: string) => {
    isTypeaheadCheckboxOptionSelected(option, dataCy);
  }
);
