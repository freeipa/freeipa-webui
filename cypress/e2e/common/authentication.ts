import { When, Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import { navigateTo } from "./navigation";

const login = (username: string, password: string) => {
  navigateTo("login");

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
  logoutStep();
  cy.location("pathname").should("match", new RegExp(`.*login$`));
};

const logoutStep = () => {
  cy.dataCy("toolbar-username").click();
  cy.dataCy("toolbar-username").should("have.attr", "aria-expanded", "true");
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
  logoutStep();
});

Then("I should be logged out", () => {
  cy.location("pathname").should("match", new RegExp(`.*login$`));
});
