import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import { createUserExec } from "../common/user_management";
import { isElementDisabled, isElementEnabled } from "../common/data_tables";

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
    createUserExec(login, firstName, lastName, password);
    cy.ipa({
      command: "user-disable",
      name: login,
    });
  }
);
