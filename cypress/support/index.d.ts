/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    dataCy(value: string): Chainable<Subject>;
  }
}
