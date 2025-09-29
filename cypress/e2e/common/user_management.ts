import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "./authentication";
import {
  entryDoesNotExist,
  entryExists,
  searchForEntry,
  selectEntry,
} from "./data_tables";

const fillUser = (
  firstName: string,
  lastName: string,
  password: string,
  login?: string
) => {
  if (login) {
    cy.dataCy("modal-textbox-login").type(login);
    cy.dataCy("modal-textbox-login").should("have.value", login);
  }

  cy.dataCy("modal-textbox-first-name").type(firstName);
  cy.dataCy("modal-textbox-first-name").should("have.value", firstName);

  cy.dataCy("modal-textbox-last-name").type(lastName);
  cy.dataCy("modal-textbox-last-name").should("have.value", lastName);

  cy.dataCy("modal-textbox-new-password").type(password);
  cy.dataCy("modal-textbox-new-password").should("have.value", password);

  cy.dataCy("modal-textbox-verify-password").type(password);
  cy.dataCy("modal-textbox-verify-password").should("have.value", password);
};

export const createUser = (
  firstName: string,
  lastName: string,
  password: string,
  login?: string
) => {
  cy.dataCy("active-users-button-add").click();
  cy.dataCy("add-user-modal").should("exist");

  fillUser(firstName, lastName, password, login);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-user-modal").should("not.exist");
};

export const validateUser = (login: string) => {
  searchForEntry(login);
  entryExists(login);
};

When(
  "I create user {string} {string} {string} with password {string}",
  (login: string, firstName: string, lastName: string, password: string) => {
    createUser(firstName, lastName, password, login);
  }
);

Then("I should see user {string} in the user list", (username: string) => {
  validateUser(username);
});

Given(
  "User {string} {string} {string} exists and is using password {string}",
  (login: string, firstName: string, lastName: string, password: string) => {
    loginAsAdmin();
    createUser(firstName, lastName, password, login);
    validateUser(login);
    logout();
  }
);

Given("I delete user {string}", (username: string) => {
  loginAsAdmin();
  selectEntry(username);

  cy.dataCy("active-users-button-delete").click();
  cy.dataCy("delete-users-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-users-modal").should("not.exist");

  searchForEntry(username);
  entryDoesNotExist(username);
  logout();
});
