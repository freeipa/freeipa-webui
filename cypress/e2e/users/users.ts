import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import { createUser, validateUser } from "../common/user_management";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  entryExists,
  isElementDisabled,
  isElementEnabled,
  isSelected,
  searchForEntry,
  selectEntry,
} from "../common/data_tables";

const disableUser = (login: string) => {
  searchForEntry(login);
  entryExists(login);

  selectEntry(login);
  isSelected(login);

  cy.dataCy("active-users-button-disable").click();
  cy.dataCy("disable-users-modal").should("exist");

  cy.dataCy("modal-button-disable").click();
  cy.dataCy("disable-users-modal").should("not.exist");

  searchForEntry(login);
  entryExists(login);
  isDisabled(login);
};

const USER_STATUS_LABEL = "Status";

const isDisabled = (name: string) => {
  isElementDisabled(name, USER_STATUS_LABEL);
};

const isEnabled = (name: string) => {
  isElementEnabled(name, USER_STATUS_LABEL);
};

Then(
  "I should see {string} user in the data table disabled",
  (name: string) => {
    isDisabled(name);
  }
);

Then("I should see {string} user in the data table enabled", (name: string) => {
  isEnabled(name);
});

Given(
  "Disabled user {string} {string} {string} exists and is using password {string}",
  (login: string, firstName: string, lastName: string, password: string) => {
    loginAsAdmin();
    createUser(firstName, lastName, password, login);
    validateUser(login);
    disableUser(login);
    logout();
  }
);
