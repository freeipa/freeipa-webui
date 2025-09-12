import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import {
  entryDoesNotExist,
  entryExists,
  searchForEntry,
  selectEntry,
  validateEntry,
} from "../common/data_tables";
import "../hostgroups/hostgroup";
import "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { loginAsAdmin, logout } from "../common/authentication";
import { createHostgroup } from "../hostgroups/hostgroup";
import { isOptionSelected, selectOption } from "../common/ui/select";

export const fillHostgroupRule = (hostgroupName: string) => {
  selectOption(hostgroupName, "modal-select-automember");
  isOptionSelected(hostgroupName, "modal-select-automember");
};

export const createHostgroupRule = (hostgroupName: string) => {
  cy.dataCy("auto-member-host-rules-button-add").click();
  cy.dataCy("add-rule-modal").should("exist");

  fillHostgroupRule(hostgroupName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-hostgroup-rule-modal").should("not.exist");
};

export const deleteHostgroupRule = (hostgroupName: string) => {
  selectEntry(hostgroupName);

  cy.dataCy("auto-member-host-rules-button-delete").click();
  cy.dataCy("delete-rule-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-rule-modal").should("not.exist");

  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
  cy.dataCy("delete-rule-success").should("exist");
};

export const setDefaultHostgroupRule = (hostgroupName: string) => {
  cy.dataCy("typeahead-select-toggle").click();
  cy.dataCy("typeahead-select-" + hostgroupName).click();
  cy.dataCy("auto-member-default-host-rules-modal").should("exist");

  cy.dataCy("modal-button-ok").click();
  cy.dataCy("auto-member-default-host-rules-modal").should("not.exist");
  cy.get("[data-cy='typeahead-select-toggle'] input").should(
    "have.value",
    hostgroupName
  );
  cy.dataCy("default-group-success").should("exist");
};

Given("hostgroup rule {string} exists", (hostgroupName: string) => {
  loginAsAdmin();
  navigateTo("host-groups");

  createHostgroup(hostgroupName, "test");
  searchForEntry(hostgroupName);
  entryExists(hostgroupName);

  navigateTo("host-group-rules");
  createHostgroupRule(hostgroupName);

  searchForEntry(hostgroupName);
  entryExists(hostgroupName);
  logout();
});

When(
  "I create hostgroup rule based on hostgroup {string}",
  (hostgroupName: string) => {
    createHostgroupRule(hostgroupName);
  }
);

Then(
  "I should see hostgroup rule {string} in the hostgroup rule list",
  (hostgroupName: string) => {
    validateEntry(hostgroupName);
  }
);

Then(
  "I should see hostgroup rule {string} as the default hostgroup rule",
  (hostgroupName: string) => {
    cy.get("[data-cy='typeahead-select-toggle'] > button").click();
    cy.get("[data-cy='typeahead-select-toggle'] > button").should(
      "have.attr",
      "aria-expanded",
      "true"
    );
    cy.dataCy("typeahead-select-" + hostgroupName).click();
    cy.dataCy("auto-member-default-host-rules-modal").should("exist");
  }
);

Then(
  "I should not see hostgroup rule {string} in the hostgroup rule list",
  (hostgroupName: string) => {
    searchForEntry(hostgroupName);
    entryDoesNotExist(hostgroupName);
  }
);

Given("I delete hostgroup rule {string}", (hostgroupName: string) => {
  loginAsAdmin();
  navigateTo("host-group-rules");

  deleteHostgroupRule(hostgroupName);

  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
  logout();
});

When("I try to delete hostgroup rule {string}", (hostgroupName: string) => {
  navigateTo("host-group-rules");
  deleteHostgroupRule(hostgroupName);
  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
});

When("I set default hostgroup rule {string}", (hostgroupName: string) => {
  setDefaultHostgroupRule(hostgroupName);
});
