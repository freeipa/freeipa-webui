import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  selectEntry,
  searchForEntry,
  entryDoesNotExist,
  entryExists,
  isSelected,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { createUser, validateUser } from "../common/user_management";

const preserveUser = (username: string) => {
  searchForEntry(username);
  entryExists(username);

  selectEntry(username);
  isSelected(username);

  cy.dataCy("active-users-button-delete").click();
  cy.dataCy("delete-users-modal").should("exist");

  cy.dataCy("modal-radio-preserve").click();
  cy.dataCy("modal-radio-preserve").should("be.checked");
  cy.dataCy("preserve-users-modal").should("exist");

  cy.dataCy("modal-button-preserve").click();
  cy.dataCy("preserve-users-modal").should("not.exist");

  searchForEntry(username);
  entryDoesNotExist(username);

  navigateTo("preserved-users");

  searchForEntry(username);
  entryExists(username);
};

Given("I delete preserved user {string}", (username: string) => {
  loginAsAdmin();
  navigateTo("preserved-users");
  selectEntry(username);

  cy.dataCy("preserved-users-button-delete").click();
  cy.dataCy("delete-users-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-users-modal").should("not.exist");

  searchForEntry(username);
  entryDoesNotExist(username);
  logout();
});

Given(
  "Preserved user {string} {string} {string} exists and is using password {string}",
  (login: string, firstName: string, lastName: string, password: string) => {
    loginAsAdmin();
    createUser(firstName, lastName, password, login);
    validateUser(login);
    preserveUser(login);
    logout();
  }
);
