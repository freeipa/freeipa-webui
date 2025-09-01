import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../../common/authentication";
import {
  selectEntry,
  searchForEntry,
  entryDoesNotExist,
  entryExists,
  checkEntry,
} from "../../common/data_tables";
import { navigateTo } from "../../common/navigation";
import { typeInTextbox } from "../../common/ui/textbox";
import { findEntryInTable } from "../../common/settings_table";
import { addItemToRightList } from "../../common/ui/dual_list";

Given("rule {string} exists", (ruleName: string) => {
  loginAsAdmin();
  navigateTo("hbac-rules");

  cy.dataCy("hbac-rules-button-add").click();
  cy.dataCy("add-hbac-rule-modal").should("exist");

  typeInTextbox("modal-textbox-rule-name", ruleName);
  cy.dataCy("modal-textbox-rule-name").should("have.value", ruleName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-hbac-rule-modal").should("not.exist");

  searchForEntry(ruleName);
  entryExists(ruleName);
  logout();
});

Given("I delete rule {string}", (ruleName: string) => {
  loginAsAdmin();
  navigateTo("hbac-rules");
  selectEntry(ruleName);

  cy.dataCy("hbac-rules-button-delete").click();
  cy.dataCy("delete-hbac-rules-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-hbac-rules-modal").should("not.exist");

  searchForEntry(ruleName);
  entryDoesNotExist(ruleName);
  logout();
});

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
    const hostFqdn = `${host}.${Cypress.env("HOSTNAME")}`;

    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    cy.dataCy("hbac-rules-tab-settings-tab-hosts").click();
    cy.dataCy("hbac-rules-tab-settings-tab-hosts").should("be.visible");

    cy.dataCy("settings-button-add-host").click();
    cy.dataCy("dual-list-modal").should("exist");

    cy.dataCy("dual-list-search-link").click();
    addItemToRightList(hostFqdn);

    cy.dataCy("modal-button-add").click();
    cy.dataCy("dual-list-modal").should("not.exist");
    cy.dataCy("add-member-success").should("exist");

    findEntryInTable(hostFqdn, "host");
    entryExists(hostFqdn);
    logout();
  }
);

Given(
  "I delete host {string} from rule {string}",
  (host: string, ruleName: string) => {
    loginAsAdmin();
    navigateTo(`hbac-rules/${ruleName}`);

    const fullHost = host + "." + Cypress.env("HOSTNAME");
    cy.dataCy("hbac-rules-tab-settings-tab-hosts").click();
    cy.dataCy("hbac-rules-tab-settings-tab-hosts").should("be.visible");

    findEntryInTable(fullHost, "host");
    entryExists(fullHost);

    findEntryInTable(fullHost, "host");
    checkEntry(fullHost);

    cy.dataCy("settings-button-delete-host").click();
    cy.dataCy("remove-hbac-rule-members-modal").should("exist");
    entryExists(fullHost);

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("remove-member-success").should("exist");
    entryDoesNotExist(fullHost);

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
