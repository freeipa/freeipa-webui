import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import {
  entryDoesNotExist,
  entryExists,
  searchForEntry,
  selectEntry,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";

const fillHostgroup = (hostgroupName: string, hostgroupDescription: string) => {
  cy.dataCy("modal-textbox-hostgroup-name").type(hostgroupName);
  cy.dataCy("modal-textbox-hostgroup-name").should("have.value", hostgroupName);

  cy.dataCy("modal-textbox-hostgroup-description").type(hostgroupDescription);
  cy.dataCy("modal-textbox-hostgroup-description").should(
    "have.value",
    hostgroupDescription
  );
};

const createHostgroup = (
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
  "hostgroup {string} with description {string} exists",
  (hostgroupName: string, hostgroupDescription: string) => {
    cy.ipa({
      command: "hostgroup-add",
      name: hostgroupName,
      specificOptions: `--desc="${hostgroupDescription}"`,
    });
  }
);

Given("I delete hostgroup {string}", (hostgroupName: string) => {
  cy.ipa({
    command: "hostgroup-del",
    name: hostgroupName,
  });
});

When("I try to delete hostgroup {string}", (hostgroupName: string) => {
  navigateTo("host-groups");
  deleteHostgroup(hostgroupName);
  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
});

Given(
  "user {string} is manager of hostgroup {string}",
  (user: string, hostgroup: string) => {
    cy.ipa({
      command: "hostgroup-add-member-manager",
      name: hostgroup,
      specificOptions: `--users=${user}`,
    });
  }
);

Given(
  "I remove user member manager {string} from hostgroup {string}",
  (user: string, hostgroup: string) => {
    cy.ipa({
      command: "hostgroup-remove-member-manager",
      name: hostgroup,
      specificOptions: `--users=${user}`,
    });
  }
);

Given(
  "user group {string} is manager of hostgroup {string}",
  (group: string, hostgroup: string) => {
    cy.ipa({
      command: "hostgroup-add-member-manager",
      name: hostgroup,
      specificOptions: `--groups=${group}`,
    });
  }
);

Given(
  "I remove group member manager {string} from hostgroup {string}",
  (group: string, hostgroup: string) => {
    cy.ipa({
      command: "hostgroup-remove-member-manager",
      name: hostgroup,
      specificOptions: `--groups=${group}`,
    });
  }
);
