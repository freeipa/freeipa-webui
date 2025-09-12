import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import {
  entryDoesNotExist,
  entryExists,
  searchForEntry,
  selectEntry,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { loginAsAdmin, logout } from "../common/authentication";

const fillHostgroup = (hostgroupName: string, hostgroupDescription: string) => {
  cy.dataCy("modal-textbox-hostgroup-name").type(hostgroupName);
  cy.dataCy("modal-textbox-hostgroup-name").should("have.value", hostgroupName);

  cy.dataCy("modal-textbox-hostgroup-description").type(hostgroupDescription);
  cy.dataCy("modal-textbox-hostgroup-description").should(
    "have.value",
    hostgroupDescription
  );
};

export const createHostgroup = (
  hostgroupName: string,
  hostgroupDescription: string
) => {
  cy.dataCy("host-groups-button-add").click();
  cy.dataCy("add-hostgroup-modal").should("exist");

  fillHostgroup(hostgroupName, hostgroupDescription);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-hostgroup-modal").should("not.exist");
};

const deleteHostgroup = (hostgroupName: string) => {
  selectEntry(hostgroupName);

  cy.dataCy("host-groups-button-delete").click();
  cy.dataCy("delete-hostgroups-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-hostgroups-modal").should("not.exist");

  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
};

const validateHostgroup = (hostgroupName: string) => {
  searchForEntry(hostgroupName);
  entryExists(hostgroupName);
};

When(
  "I create hostgroup {string} with description {string}",
  (hostgroupName: string, hostgroupDescription: string) => {
    createHostgroup(hostgroupName, hostgroupDescription);
  }
);

Then(
  "I should see hostgroup {string} in the data table",
  (hostgroupName: string) => {
    validateHostgroup(hostgroupName);
  }
);

Then(
  "I should not see hostgroup {string} in the data table",
  (hostgroupName: string) => {
    searchForEntry(hostgroupName);
    entryDoesNotExist(hostgroupName);
  }
);

Given(
  "Hostgroup {string} with description {string} exists",
  (hostgroupName: string, hostgroupDescription: string) => {
    loginAsAdmin();
    navigateTo("host-groups");

    createHostgroup(hostgroupName, hostgroupDescription);
    validateHostgroup(hostgroupName);

    logout();
  }
);

Given("I delete hostgroup {string}", (hostgroupName: string) => {
  loginAsAdmin();
  navigateTo("host-groups");

  deleteHostgroup(hostgroupName);

  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
  logout();
});

When("I try to delete hostgroup {string}", (hostgroupName: string) => {
  navigateTo("host-groups");
  deleteHostgroup(hostgroupName);
  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
});
