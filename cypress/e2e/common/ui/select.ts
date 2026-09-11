import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When(
  "I select {string} option in the {string} selector",
  (option: string, selector: string) => {
    selectOption(option, selector);
  }
);

Then(
  "I should see {string} option in the {string} selector",
  (option: string, selector: string) => {
    isOptionSelected(option, selector);
  }
);

export const selectOption = (option: string, selector: string) => {
  cy.dataCy(selector + "-toggle").click();
  cy.dataCy(selector + "-toggle").should("have.attr", "aria-expanded", "true");
  cy.dataCy(selector + "-" + option)
    .find("button")
    .scrollIntoView();
  cy.dataCy(selector + "-" + option)
    .find("button")
    .click();
};

export const isOptionSelected = (option: string, selector: string) => {
  cy.dataCy(selector + "-toggle").contains(option);
};

export const selectIpaSelectOption = (dataCy: string, option: string) => {
  cy.dataCy(dataCy).click();
  cy.dataCy(dataCy).should("have.attr", "aria-expanded", "true");
  cy.dataCy(`${dataCy}-select-${option}`).click();
};

export const isIpaSelectOptionSelected = (dataCy: string, option: string) => {
  cy.dataCy(dataCy).contains(option);
};

When(
  "I select {string} option in the {string} ipa select",
  (option: string, dataCy: string) => {
    selectIpaSelectOption(dataCy, option);
  }
);

Then(
  "I should see {string} option in the {string} ipa select",
  (option: string, dataCy: string) => {
    isIpaSelectOptionSelected(dataCy, option);
  }
);
