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

Cypress.Commands.add("dataCy", (value: string) => {
  return cy.get(`[data-cy='${value}']`);
});

// Register a helper to run IPA commands inside the webui container.
// Usage:
//   cy.ipa("hbacsvc-show", "my_service", { failOnNonZeroExit: false })
//   cy.ipa("hbacsvc-add", "my_service")
// Returns the result of cy.exec so you can inspect code/stdout/stderr.
Cypress.Commands.add(
  "ipa",
  (
    subCommand: string,
    name?: string,
    options?: Partial<Cypress.ExecOptions>
  ): Cypress.Chainable<Cypress.Exec> => {
    // Ensure any quotes in the name are escaped to avoid breaking the shell
    const safeName = name?.replace(/"/g, '\\"');
    const cmd = `podman exec webui ipa ${subCommand} "${safeName}"`;
    return cy.exec(cmd, options);
  }
);
