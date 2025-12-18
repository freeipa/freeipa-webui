import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import {
  entryDoesNotExist,
  searchForEntry,
  selectEntry,
  validateEntry,
} from "../common/data_tables";
import "../hostgroups/hostgroup";
import "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { loginAsAdmin, logout } from "../common/authentication";
import { isOptionSelected, selectOption } from "../common/ui/select";

const fillHostgroupRule = (hostgroupName: string) => {
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

const deleteHostgroupRule = (hostgroupName: string) => {
  selectEntry(hostgroupName);

  cy.dataCy("auto-member-host-rules-button-delete").click();
  cy.dataCy("delete-rule-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-rule-modal").should("not.exist");

  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
  cy.dataCy("delete-rule-success").should("exist");
};

const setDefaultHostgroupRule = (hostgroupName: string) => {
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
  cy.ipa({
    command: "automember-add",
    name: hostgroupName,
    specificOptions: "--type hostgroup",
  }).then((result) => {
    cy.log(result.stderr);
    cy.log(result.stdout);
  });
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
