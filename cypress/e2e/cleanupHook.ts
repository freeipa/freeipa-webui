import { Before } from "@badeball/cypress-cucumber-preprocessor";

Before(() => {
  cy.log("Running IPA cleanup)");
  cy.task("ipaCleanup", {
    serverName: Cypress.env("SERVER_NAME"),
    adminLogin: Cypress.env("ADMIN_LOGIN"),
    adminPassword: Cypress.env("ADMIN_PASSWORD"),
  });
});
