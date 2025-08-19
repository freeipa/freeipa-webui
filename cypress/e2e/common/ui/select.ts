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
  cy.dataCy(selector + "-" + option).click();
};

export const isOptionSelected = (option: string, selector: string) => {
  cy.dataCy(selector + "-toggle").contains(option);
};
