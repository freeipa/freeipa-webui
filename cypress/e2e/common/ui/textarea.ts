import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

export const typeInTextarea = (textarea: string, text: string) => {
  cy.dataCy(textarea).clear();
  cy.dataCy(textarea).should("have.value", "");
  cy.dataCy(textarea).type(text);
};

When(
  "I type in the {string} textarea text {string}",
  (textarea: string, text: string) => {
    typeInTextarea(textarea, text);
  }
);

Then(
  "I should see {string} in the {string} textarea",
  (text: string, textarea: string) => {
    cy.dataCy(textarea).should("have.value", text);
  }
);

When("I clear the {string} textarea", (textarea: string) => {
  cy.dataCy(textarea).clear();
});

Then("I should see the {string} textarea is empty", (textarea: string) => {
  cy.dataCy(textarea).should("have.value", "");
});
