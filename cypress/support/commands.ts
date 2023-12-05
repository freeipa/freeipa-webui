/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
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
export {}; // needed for modification of global scope to work properly

declare global {
  namespace Cypress {
    interface Chainable {
      createTestUser(username: string): Chainable<void>;
      loginAsAnUser(username: string, password: string): Chainable<void>;
      userCleanup(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("loginAsAnUser", (username: string, password: string) => {
  // temporary solution as the new UI doesn't have login page yet
  cy.visit("/ipa/ui");
  cy.get("[id=username1]").type(username);
  cy.get("[id=password2").type(password);
  cy.get("button[name=login]").click();
  cy.wait(1000);
  cy.visit(Cypress.env("base_url"));
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
  cy.wait(1000);
  cy.get("tr[id=" + username + "]")
    .should(() => undefined)
    .then(($user) => {
      if ($user.length == 0) {
        cy.get("button").contains("Add").click();
        cy.get("[role=dialog] label")
          .contains("User login")
          .parent()
          .then(($label) => {
            cy.get("[name=modal-form-" + $label.attr("for") + "]").type(
              username
            );
          });
        cy.get("[role=dialog] label")
          .contains("First name")
          .parent()
          .then(($label) => {
            cy.get("[name=modal-form-" + $label.attr("for") + "]").type(
              "Arctic"
            );
          });
        cy.get("[role=dialog] label")
          .contains("Last name")
          .parent()
          .then(($label) => {
            cy.get("[name=modal-form-" + $label.attr("for") + "]").type(
              "Asbestos"
            );
          });
        cy.get("[role=dialog] button").contains("Add").click();
      }
    });
});
