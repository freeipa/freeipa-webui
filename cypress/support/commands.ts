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

import { IPA_PREFIX } from "./utils";

Cypress.Commands.add("dataCy", (value: string) => {
  return cy.get(`[data-cy='${value}']`);
});

export type IpaCommandParams = {
  command: string;
  name: string;
  specificOptions?: string;
  options?: Partial<Cypress.ExecOptions>;
};

// Register a helper to run IPA commands inside the webui container.
// Automatically runs kinit before each IPA command.
// Usage:
//   cy.ipa("hbacsvc-show", "my_service", { failOnNonZeroExit: false })
//   cy.ipa("hbacsvc-add", "my_service")
// Returns the result of cy.exec so you can inspect code/stdout/stderr.
Cypress.Commands.add(
  "ipa",
  ({
    command,
    name,
    specificOptions,
  }: IpaCommandParams): Cypress.Chainable<Cypress.Exec> => {
    const safeName = name.replace(/"/g, '\\"');
    let ipaCmd = `${IPA_PREFIX} ${command} "${safeName}"`;
    if (specificOptions) {
      ipaCmd = `${IPA_PREFIX} ${command} "${safeName}" ${specificOptions}`;
    }

    return cy.exec(ipaCmd, { failOnNonZeroExit: false });
  }
);
