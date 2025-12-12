/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    dataCy(value: string): Chainable<Subject>;
    ipa(
      subCommand: string,
      name?: string,
      specificOptions?: string,
      options?: Partial<Cypress.ExecOptions>
    ): Chainable<Cypress.Exec>;
  }
}
