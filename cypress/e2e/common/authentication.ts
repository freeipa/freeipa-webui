import { When, Given, Then } from "@badeball/cypress-cucumber-preprocessor";

const login = (username: string, password: string) => {
  cy.visit(Cypress.env("BASE_URL") + "/login");

  cy.get("#pf-login-username-id").type(username);
  cy.get("#pf-login-username-id").should("have.value", username);

  cy.get("#pf-login-password-id").type(password);
  cy.get("#pf-login-password-id").should("have.value", password);

  cy.get("button[type='submit']").click();
};

export const loginAsAdmin = () => {
  login(Cypress.env("ADMIN_LOGIN"), Cypress.env("ADMIN_PASSWORD"));
  cy.dataCy("toolbar-username").should("have.text", "Administrator");
};

export const logout = () => {
  cy.dataCy("toolbar-username").click();
  cy.dataCy("toolbar-button-logout").click();
};

Given("I am logged in as admin", () => {
  loginAsAdmin();
});

When(
  "I log in as {string} with password {string}",
  (username: string, password: string) => login(username, password)
);

Then("I should be logged in as {string}", (username: string) => {
  cy.dataCy("toolbar-username").should("have.text", username);
});

When("I log out", () => {
  logout();
});

Then("I should be logged out", () => {
  cy.dataCy("toolbar-username").should("not.exist");
});
