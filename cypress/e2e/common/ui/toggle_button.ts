import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I should see the {string} toggle button is pressed", (button: string) => {
  cy.get("[data-cy=" + button + "] button").should(
    "have.attr",
    "aria-pressed",
    "true"
  );
});

Then(
  "I should see the {string} toggle button is not pressed",
  (button: string) => {
    cy.get("[data-cy=" + button + "] button").should(
      "have.attr",
      "aria-pressed",
      "false"
    );
  }
);
