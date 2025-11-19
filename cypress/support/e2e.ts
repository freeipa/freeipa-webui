// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:

import { addCustomCommand } from "cy-verify-downloads";

addCustomCommand();

import "./commands";

// Authenticate with Kerberos once before running any tests
before(() => {
  const password = Cypress.env("ADMIN_PASSWORD");
  const kinitCmd = `echo "${password}" | podman exec -i webui kinit admin`;
  cy.exec(kinitCmd, { failOnNonZeroExit: true });
});
