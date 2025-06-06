/// <reference types="cypress" />

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    createTestUser(username: string, password?: boolean): Chainable<void>;
    loginAsAnUser(
      username: string,
      password: string,
      otp?: string
    ): Chainable<void>;
    logout(): Chainable<void>;
    userCleanup(): Chainable<void>;
  }
}
