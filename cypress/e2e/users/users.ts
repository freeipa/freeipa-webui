import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { createUser, fillUser, validateUser } from "../common/user_management";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  entryExists,
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

const isDisabled = (name: string) => {
  cy.get("tr[id='" + name + "'] td[data-label=Status]").contains("Disabled");
};

const isEnabled = (name: string) => {
  cy.get("tr[id='" + name + "'] td[data-label=Status]").contains("Enabled");
};

When(
  "I fill in user {string} {string} {string} with password {string} and click add another",
  (login: string, firstName: string, lastName: string, password: string) => {
    fillUser(firstName, lastName, password, login);

    cy.dataCy("modal-button-add-and-add-another").click();
    cy.dataCy("add-user-modal").should("exist");
  }
);

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
