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

import { IPA_PREFIX, IPA_PREFIX_INTERACTIVE } from "./utils";

Cypress.Commands.add("dataCy", (value: string) => {
  return cy.get(`[data-cy='${value}']`);
});

export type IpaCommandParams = {
  command: string;
  name: string;
  specificOptions?: string;
  options?: Partial<Cypress.ExecOptions>;
  // Piped to the command's stdin (e.g. a password prompt).
  stdin?: string;
};

// Run an IPA command inside the webui container.
// Usage:
//   cy.ipa({ command: "hbacsvc-show", name: "my_service" })
//   cy.ipa({ command: "user-add", name: login, specificOptions: "--password", stdin: password })
// Resolves to the cy.exec result, so code/stdout/stderr can be inspected.
Cypress.Commands.add(
  "ipa",
  ({
    command,
    name,
    specificOptions,
    options,
    stdin,
  }: IpaCommandParams): Cypress.Chainable<Cypress.Exec> => {
    // Single-quote so $, backticks and backslashes reach the shell literally.
    const quote = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;
    const prefix = stdin === undefined ? IPA_PREFIX : IPA_PREFIX_INTERACTIVE;
    const ipaCmd = `${prefix} ${command} ${quote(name)}${specificOptions ? ` ${specificOptions}` : ""}`;
    const input =
      stdin === undefined ? "" : `printf '%s\\n' ${quote(stdin)} | `;

    return cy.exec(input + ipaCmd, options);
  }
);
