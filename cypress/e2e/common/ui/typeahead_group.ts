import { When } from "@badeball/cypress-cucumber-preprocessor";

type TypeAheadScopeOptions = {
  modal?: string;
  optionDataCy?: string;
};

const runInScope = (modal?: string, callback?: () => void) => {
  if (modal) {
    cy.dataCy(modal).within(() => {
      callback?.();
    });
  } else {
    callback?.();
  }
};

export const selectTypeAheadGroup = (
  fieldId: string,
  groupName: string,
  options: TypeAheadScopeOptions = {}
) => {
  const { modal, optionDataCy = `modal-select-group-${groupName}` } = options;

  runInScope(modal, () => {
    cy.dataCy(`${fieldId}-select-toggle`).click();
    cy.dataCy(`${fieldId}-select-toggle`)
      .find('[role="combobox"]')
      .should("have.attr", "aria-expanded", "true");
  });
  cy.dataCy(optionDataCy).should("be.visible").click();
};

export const selectTypeAheadCheckbox = (
  dataCy: string,
  option: string,
  options: TypeAheadScopeOptions = {}
) => {
  const { modal, optionDataCy = `${dataCy}-${option}` } = options;

  runInScope(modal, () => {
    cy.dataCy(`${dataCy}-multi-typeahead-checkbox-menu-toggle`).click();
  });
  cy.dataCy(optionDataCy).should("be.visible").click();
};

When(
  "I select {string} in the {string} typeahead group within {string} modal",
  (groupName: string, fieldId: string, modal: string) => {
    selectTypeAheadGroup(fieldId, groupName, { modal });
  }
);

When(
  "I select {string} in the {string} typeahead checkbox within {string} modal",
  (option: string, dataCy: string, modal: string) => {
    selectTypeAheadCheckbox(dataCy, option, { modal });
  }
);
