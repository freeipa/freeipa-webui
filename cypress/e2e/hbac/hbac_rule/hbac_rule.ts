import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../../common/authentication";
import {
  entryDoesNotExist,
  entryExists,
  checkEntry,
} from "../../common/data_tables";
import { navigateTo } from "../../common/navigation";
import { findEntryInTable } from "../../common/settings_table";
import { addItemToRightList } from "../../common/ui/dual_list";

Given(
  "I have element {string} named {string} in rule {string}",
  (elementType: string, element: string, ruleName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    cy.dataCy(`hbac-rules-tab-settings-tab-${elementType}s`).click();
    cy.dataCy(`hbac-rules-tab-settings-tab-${elementType}s`).should(
      "be.visible"
    );

    cy.dataCy(`settings-button-add-${elementType}`).click();
    cy.dataCy("dual-list-modal").should("exist");

    cy.dataCy("dual-list-search-link").click();
    addItemToRightList(element);

    cy.dataCy("modal-button-add").click();
    cy.dataCy("dual-list-modal").should("not.exist");
    cy.dataCy("add-member-success").should("exist");

    findEntryInTable(element, elementType);
    entryExists(element);

    logout();
  }
);

Given(
  "I delete element {string} named {string} from rule {string}",
  (elementType: string, element: string, ruleName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    cy.dataCy(`hbac-rules-tab-settings-tab-${elementType}s`).click();
    cy.dataCy(`hbac-rules-tab-settings-tab-${elementType}s`).should(
      "be.visible"
    );

    findEntryInTable(element, elementType);
    entryExists(element);
    checkEntry(element);

    cy.dataCy(`settings-button-delete-${elementType}`).click();
    cy.dataCy("remove-hbac-rule-members-modal").should("exist");
    entryExists(element);

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("remove-member-success").should("exist");
    entryDoesNotExist(element);

    logout();
  }
);

Given(
  "I have host {string} in rule {string}",
  (host: string, ruleName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    cy.dataCy("hbac-rules-tab-settings-tab-hosts").click();
    cy.dataCy("hbac-rules-tab-settings-tab-hosts").should("be.visible");

    cy.dataCy("settings-button-add-host").click();
    cy.dataCy("dual-list-modal").should("exist");

    cy.dataCy("dual-list-search-link").click();
    addItemToRightList(host);

    cy.dataCy("modal-button-add").click();
    cy.dataCy("dual-list-modal").should("not.exist");
    cy.dataCy("add-member-success").should("exist");

    findEntryInTable(host, "host");
    entryExists(host);
    logout();
  }
);

Given(
  "I delete host {string} from rule {string}",
  (host: string, ruleName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    cy.dataCy("hbac-rules-tab-settings-tab-hosts").click();
    cy.dataCy("hbac-rules-tab-settings-tab-hosts").should("be.visible");

    findEntryInTable(host, "host");
    entryExists(host);

    findEntryInTable(host, "host");
    checkEntry(host);

    cy.dataCy("settings-button-delete-host").click();
    cy.dataCy("remove-hbac-rule-members-modal").should("exist");
    entryExists(host);

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("remove-member-success").should("exist");
    entryDoesNotExist(host);

    logout();
  }
);

Given(
  "I have service {string} in rule {string}",
  (service: string, ruleName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    cy.dataCy("hbac-rules-tab-settings-tab-services").click();
    cy.dataCy("hbac-rules-tab-settings-tab-services").should("be.visible");

    cy.dataCy("settings-button-add-hbacsvc").click();
    cy.dataCy("dual-list-modal").should("exist");

    cy.dataCy("dual-list-search-link").click();
    addItemToRightList(service);

    cy.dataCy("modal-button-add").click();
    cy.dataCy("dual-list-modal").should("not.exist");
    cy.dataCy("add-member-success").should("exist");

    findEntryInTable(service, "hbacsvc");
    entryExists(service);

    logout();
  }
);

Given(
  "I delete service {string} from rule {string}",
  (service: string, ruleName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    cy.dataCy("hbac-rules-tab-settings-tab-services").click();
    cy.dataCy("hbac-rules-tab-settings-tab-services").should("be.visible");

    findEntryInTable(service, "hbacsvc");
    entryExists(service);

    findEntryInTable(service, "hbacsvc");
    checkEntry(service);

    cy.dataCy("settings-button-delete-hbacsvc").click();
    cy.dataCy("remove-hbac-rule-members-modal").should("exist");
    entryExists(service);

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("remove-member-success").should("exist");
    entryDoesNotExist(service);

    logout();
  }
);

Given(
  "I have servicegroup {string} in rule {string}",
  (svcGroup: string, ruleName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    cy.dataCy("hbac-rules-tab-settings-tab-servicegroups").click();
    cy.dataCy("hbac-rules-tab-settings-tab-servicegroups").should("be.visible");

    cy.dataCy("settings-button-add-hbacsvcgroup").click();
    cy.dataCy("dual-list-modal").should("exist");

    cy.dataCy("dual-list-search-link").click();
    addItemToRightList(svcGroup);

    cy.dataCy("modal-button-add").click();
    cy.dataCy("dual-list-modal").should("not.exist");
    cy.dataCy("add-member-success").should("exist");

    findEntryInTable(svcGroup, "hbacsvcgroup");
    entryExists(svcGroup);

    logout();
  }
);

Given(
  "I delete servicegroup {string} from rule {string}",
  (svcGroup: string, ruleName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    cy.dataCy("hbac-rules-tab-settings-tab-servicegroups").click();
    cy.dataCy("hbac-rules-tab-settings-tab-servicegroups").should("be.visible");

    findEntryInTable(svcGroup, "hbacsvcgroup");
    entryExists(svcGroup);

    findEntryInTable(svcGroup, "hbacsvcgroup");
    checkEntry(svcGroup);

    cy.dataCy("settings-button-delete-hbacsvcgroup").click();
    cy.dataCy("remove-hbac-rule-members-modal").should("exist");
    entryExists(svcGroup);

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("remove-member-success").should("exist");
    entryDoesNotExist(svcGroup);

    logout();
  }
);
