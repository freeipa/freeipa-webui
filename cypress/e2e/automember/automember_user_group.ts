import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import {
  entryDoesNotExist,
  entryExists,
  searchForEntry,
  selectEntry,
  validateEntry,
} from "../common/data_tables";
import "../user_groups/user_groups";
import "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { loginAsAdmin, logout } from "../common/authentication";
import { isOptionSelected, selectOption } from "../common/ui/select";

const fillUserGroupRule = (userGroupName: string, selector: string) => {
  selectOption(userGroupName, selector);
  isOptionSelected(userGroupName, selector);
};

export const createUserGroupRule = (userGroupName: string) => {
  cy.dataCy("auto-member-user-rules-button-add").click();
  cy.dataCy("add-rule-modal").should("exist");

  fillUserGroupRule(userGroupName, "modal-select-automember");

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-rule-modal").should("not.exist");
  searchForEntry(userGroupName);
  entryExists(userGroupName);
};

const deleteUserGroupRule = (userGroupName: string) => {
  selectEntry(userGroupName);

  cy.dataCy("auto-member-user-rules-button-delete").click();
  cy.dataCy("delete-rule-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-rule-modal").should("not.exist");

  searchForEntry(userGroupName);
  entryDoesNotExist(userGroupName);
  cy.dataCy("delete-rule-success").should("exist");
};

const setDefaultUserGroupRule = (userGroupName: string) => {
  cy.dataCy("typeahead-select-toggle").click();
  cy.dataCy("typeahead-select-" + userGroupName).click();
  cy.dataCy("auto-member-default-user-rules-modal").should("exist");

  cy.dataCy("modal-button-ok").click();
  cy.dataCy("auto-member-default-user-rules-modal").should("not.exist");
  cy.get("[data-cy='typeahead-select-input'] input").should(
    "have.value",
    userGroupName
  );
  cy.dataCy("default-group-success").should("exist");
};

Given("user group rule {string} exists", (userGroupName: string) => {
  cy.ipa({
    command: "automember-add",
    name: userGroupName,
    specificOptions: "--type group",
  }).then((result) => {
    cy.log(result.stderr);
    cy.log(result.stdout);
  });
});

When(
  "I create user group rule based on user group {string}",
  (userGroupName: string) => {
    createUserGroupRule(userGroupName);
  }
);

Then(
  "I should see user group rule {string} in the user group rule table",
  (userGroupName: string) => {
    validateEntry(userGroupName);
  }
);

Then(
  "I should see user group rule {string} as the default user group rule",
  (userGroupName: string) => {
    cy.dataCy("typeahead-select-input")
      .find("input")
      .should("have.value", userGroupName);
  }
);

Then(
  "I should not see user group rule {string} in the user group rule table",
  (userGroupName: string) => {
    searchForEntry(userGroupName);
    entryDoesNotExist(userGroupName);
  }
);

Given("I delete user group rule {string}", (userGroupName: string) => {
  loginAsAdmin();
  navigateTo("user-group-rules");

  deleteUserGroupRule(userGroupName);

  searchForEntry(userGroupName);
  entryDoesNotExist(userGroupName);
  logout();
});

When("I try to delete user group rule {string}", (userGroupName: string) => {
  navigateTo("user-group-rules");
  deleteUserGroupRule(userGroupName);
  searchForEntry(userGroupName);
  entryDoesNotExist(userGroupName);
});

When("I set default user group rule {string}", (userGroupName: string) => {
  setDefaultUserGroupRule(userGroupName);
});
