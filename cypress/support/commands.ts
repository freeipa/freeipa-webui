// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

import { addCustomCommand } from "cy-verify-downloads";

addCustomCommand();

Cypress.Commands.add("loginAsAnUser", (username: string, password: string) => {
  // temporary solution as the new UI doesn't have login page yet
  cy.visit(Cypress.env("login_url"));
  cy.get("[id=pf-login-username-id]").type(username);
  cy.get("[id=pf-login-password-id").type(password);
  cy.get("button").contains("Log in").click();
  cy.wait(1000);
  cy.visit(Cypress.env("base_url"));
});

Cypress.Commands.add("logout", () => {
  cy.get(".pf-v5-c-menu-toggle__text")
    .first()
    .click()
    .then(() => {
      cy.get(".pf-v5-c-menu__item").contains("Log out").click();
    });
});

Cypress.Commands.add("userCleanup", () => {
  cy.get("tr[id=admin]", { timeout: 10000 }).should("be.visible");
  cy.get('input[aria-label="Select all"]').check();
  cy.get("tr[id=admin] input[type=checkbox]").uncheck();

  cy.get("button")
    .contains("Delete")
    .then(($deleteButton) => {
      if ($deleteButton.prop("disabled")) return;
      $deleteButton.trigger("click");
      cy.get("[role=dialog] button").contains("Delete").trigger("click");
    });
});

Cypress.Commands.add("createTestUser", (username: string) => {
  cy.visit(Cypress.env("base_url") + "/active-users");
  cy.get("tr[id=admin]", { timeout: 6000 }); // wait up to 6 seconds for the user table to visible
  cy.get("tr[id=" + username + "]")
    .should(() => undefined)
    .then(($user) => {
      if ($user.length == 0) {
        cy.get("button").contains("Add").click();
        cy.get("[role=dialog] label")
          .contains("User login")
          .parent()
          .then(($label) => {
            cy.get("#" + $label.attr("for")).type(username);
          });
        cy.get("[role=dialog] label")
          .contains("First name")
          .parent()
          .then(($label) => {
            cy.get("#" + $label.attr("for")).type("Arctic");
          });
        cy.get("[role=dialog] label")
          .contains("Last name")
          .parent()
          .then(($label) => {
            cy.get("#" + $label.attr("for")).type("Asbestos");
          });
        cy.get("[role=dialog] button").contains("Add").click();
      }
    });
});
