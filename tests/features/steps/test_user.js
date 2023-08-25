import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

Given("there is only admin user active", () => {
  cy.get("tr[id=admin]", { timeout: 10000 }).should("be.visible");
  cy.get('input[aria-label="Select all"]').check();
  cy.get("tr[id=admin] input[type=checkbox]").uncheck();

  cy.get("button")
    .contains("Delete")
    .then(($deleteButton) => {
      if ($deleteButton.prop("disabled")) return;

      $deleteButton.click();
      cy.get("[role=dialog] button").contains("Delete").click();
    });
});
