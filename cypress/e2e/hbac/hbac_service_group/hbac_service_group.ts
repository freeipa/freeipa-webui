import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../../common/authentication";
import { navigateTo } from "../../common/navigation";
import {
  entryExists,
  entryDoesNotExist,
  searchForEntry,
  selectEntry,
} from "../../common/data_tables";
import { typeInTextbox } from "../../common/ui/textbox";
import { addItemToRightList } from "cypress/e2e/common/ui/dual_list";
import {
  searchForMembersEntry,
  selectMembersEntry,
} from "cypress/e2e/common/members_table";

Given("HBAC service group {string} exists", (groupName: string) => {
  loginAsAdmin();
  navigateTo("hbac-service-groups");

  searchForEntry(groupName);

  cy.dataCy("hbac-service-groups-button-add").click();
  cy.dataCy("add-hbac-service-group-modal").should("exist");

  typeInTextbox("modal-textbox-service-group-name", groupName);
  cy.dataCy("modal-textbox-service-group-name").should("have.value", groupName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-hbac-service-group-modal").should("not.exist");
  cy.dataCy("add-hbacservicegroup-success").should("exist");

  searchForEntry(groupName);
  entryExists(groupName);

  logout();
});

Given("I delete service group {string}", (groupName: string) => {
  loginAsAdmin();
  navigateTo("hbac-service-groups");

  searchForEntry(groupName);
  selectEntry(groupName);

  cy.dataCy("hbac-service-groups-button-delete").click();
  cy.dataCy("delete-hbac-service-groups-modal").should("exist");
  entryExists(groupName);

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("remove-hbacservicegroups-success").should("exist");
  entryDoesNotExist(groupName);

  logout();
});

Given(
  "I add service group member {string} to service group {string}",
  (serviceName: string, groupName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-service-groups/${groupName}`);

    cy.dataCy("hbac-service-groups-tab-members").click();
    cy.dataCy("hbac-service-groups-tab-members").should(
      "have.attr",
      "aria-selected",
      "true"
    );

    cy.dataCy("member-of-button-add").click();
    cy.dataCy("member-of-add-modal").should("exist");

    addItemToRightList(serviceName);

    cy.dataCy("modal-button-add").click();
    cy.dataCy("member-of-add-modal").should("not.exist");
    cy.dataCy("add-member-success").should("exist");

    searchForMembersEntry(serviceName);
    entryExists(serviceName);

    logout();
  }
);

Given(
  "I delete service group member {string} from service group {string}",
  (serviceName: string, groupName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-service-groups/${groupName}`);

    cy.dataCy("hbac-service-groups-tab-members").click();
    cy.dataCy("hbac-service-groups-tab-members").should(
      "have.attr",
      "aria-selected",
      "true"
    );

    searchForMembersEntry(serviceName);
    selectMembersEntry(serviceName);

    cy.dataCy("member-of-button-delete").click();
    cy.dataCy("member-of-delete-modal").should("exist");

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("member-of-delete-modal").should("not.exist");
    cy.dataCy("remove-members-success").should("exist");

    searchForMembersEntry(serviceName);
    entryDoesNotExist(serviceName);

    logout();
  }
);
