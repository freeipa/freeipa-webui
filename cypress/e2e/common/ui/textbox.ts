import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When(
  "I type in the {string} textbox text {string}",
  (textbox: string, text: string) => {
    cy.dataCy(textbox).clear();
    cy.dataCy(textbox).should("have.value", "");
    cy.dataCy(textbox).type(text);
  }
);

Then(
  "I should see {string} in the {string} textbox",
  (text: string, textbox: string) => {
    cy.dataCy(textbox).should("have.value", text);
  }
);

When("I clear the {string} textbox", (textbox: string) => {
  cy.dataCy(textbox).clear();
});

Then("I should see the {string} textbox is empty", (textbox: string) => {
  cy.dataCy(textbox).should("have.value", "");
});
