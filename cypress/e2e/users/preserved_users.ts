import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { createUserExec } from "../common/user_management";

Given("I delete preserved user {string}", (username: string) => {
  cy.ipa({
    command: "user-del",
    name: username,
    specificOptions: "--no-preserve",
  });
});

Given(
  "Preserved user {string} {string} {string} exists and is using password {string}",
  (login: string, firstName: string, lastName: string, password: string) => {
    createUserExec(login, firstName, lastName, password);
    cy.ipa({
      command: "user-del",
      name: login,
      specificOptions: "--preserve",
    });
  }
);
