/// <reference types="cypress" />

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    createTestUser(username: string): Chainable<void>;
    loginAsAnUser(username: string, password: string): Chainable<void>;
    userCleanup(): Chainable<void>;
  }
}
