import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../../common/authentication";
import { navigateTo } from "../../common/navigation";
import {
  entryExists,
  entryDoesNotExist,
  searchForEntry,
  selectEntry,
} from "../../common/data_tables";
import { typeInTextbox } from "cypress/e2e/common/ui/textbox";
import { addItemToRightList } from "cypress/e2e/common/ui/dual_list";
import {
  searchForMembersEntry,
  selectMembersEntry,
} from "cypress/e2e/common/members_table";

Given("HBAC service {string} exists", (serviceName: string) => {
  loginAsAdmin();
  navigateTo("hbac-services");

  searchForEntry(serviceName);
  cy.dataCy("hbac-services-button-add").click();
  cy.dataCy("add-hbac-service-modal").should("exist");

  typeInTextbox("modal-textbox-service-name", serviceName);
  cy.dataCy("modal-textbox-service-name").should("have.value", serviceName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-hbac-service-modal").should("not.exist");
  cy.dataCy("add-hbacservice-success").should("exist");

  searchForEntry(serviceName);
  entryExists(serviceName);

  logout();
});

Given("I delete service {string}", (serviceName: string) => {
  loginAsAdmin();
  navigateTo("hbac-services");

  searchForEntry(serviceName);
  selectEntry(serviceName);

  cy.dataCy("hbac-services-button-delete").click();
  cy.dataCy("delete-hbac-services-modal").should("exist");
  entryExists(serviceName);

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("remove-hbacservices-success").should("exist");
  entryDoesNotExist(serviceName);

  logout();
});

Given(
  "I add service group member {string} to service {string}",
  (groupName: string, serviceName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-services/${serviceName}`);

    cy.dataCy("hbac-service-is-member-of-tab").click();
    cy.dataCy("hbac-service-is-member-of-tab").should(
      "have.attr",
      "aria-selected",
      "true"
    );

    cy.dataCy("member-of-button-add").click();
    cy.dataCy("member-of-add-modal").should("exist");

    addItemToRightList(groupName);

    cy.dataCy("modal-button-add").click();
    cy.dataCy("member-of-add-modal").should("not.exist");
    cy.dataCy("add-member-success").should("exist");

    searchForMembersEntry(groupName);
    entryExists(groupName);

    logout();
  }
);

Given(
  "I delete service group member {string} from service {string}",
  (groupName: string, serviceName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-services/${serviceName}`);

    cy.dataCy("hbac-service-is-member-of-tab").click();
    cy.dataCy("hbac-service-is-member-of-tab").should(
      "have.attr",
      "aria-selected",
      "true"
    );

    searchForMembersEntry(groupName);
    selectMembersEntry(groupName);

    cy.dataCy("member-of-button-delete").click();
    cy.dataCy("member-of-delete-modal").should("exist");

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("member-of-delete-modal").should("not.exist");
    cy.dataCy("remove-hbac-services-success").should("exist");

    searchForMembersEntry(groupName);
    entryDoesNotExist(groupName);

    logout();
  }
);
