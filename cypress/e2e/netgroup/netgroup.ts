import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import { navigateTo } from "../common/navigation";
import {
  selectEntry,
  searchForEntry,
  entryDoesNotExist,
  entryExists,
  checkEntry,
} from "../common/data_tables";
import { typeInTextbox } from "../common/ui/textbox";
import { findEntryInTable } from "../common/settings_table";
import { addItemToRightList } from "../common/ui/dual_list";

Given("netgroup {string} exists", (groupName: string) => {
  loginAsAdmin();
  navigateTo("netgroups");

  cy.dataCy("netgroups-button-add").click();
  cy.dataCy("add-netgroup-modal").should("exist");

  typeInTextbox("modal-textbox-netgroup-name", groupName);
  cy.dataCy("modal-textbox-netgroup-name").should("have.value", groupName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-netgroup-modal").should("not.exist");

  searchForEntry(groupName);
  entryExists(groupName);
  logout();
});

Given("I delete netgroup {string}", (groupName: string) => {
  loginAsAdmin();
  navigateTo("netgroups");
  selectEntry(groupName);

  cy.dataCy("netgroups-button-delete").click();
  cy.dataCy("delete-netgroups-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-netgroups-modal").should("not.exist");

  searchForEntry(groupName);
  entryDoesNotExist(groupName);
  logout();
});

const elementTypeToTabDataCy = (elementType: string): string => {
  const key = elementType.toLowerCase();
  if (key === "user") return "netgroups-tab-settings-tab-users";
  if (key === "group") return "netgroups-tab-settings-tab-groups";
  if (key === "host") return "netgroups-tab-settings-tab-hosts";
  if (key === "hostgroup") return "netgroups-tab-settings-tab-hostgroups";
  if (key === "externalhost") return "netgroups-tab-settings-tab-externalhosts";
  return "";
};

const ensureTabVisibleAndOpen = (elementType: string) => {
  const tabDataCy = elementTypeToTabDataCy(elementType);
  if (tabDataCy) {
    cy.dataCy(tabDataCy).click();
    cy.dataCy(tabDataCy).should("exist");
    cy.dataCy(tabDataCy).should("be.visible");
  }
};

Given(
  "I have element {string} named {string} in netgroup {string}",
  (elementType: string, element: string, groupName: string) => {
    loginAsAdmin();
    navigateTo(`netgroups/${groupName}`);

    ensureTabVisibleAndOpen(elementType);

    cy.dataCy(`settings-button-add-${elementType}`).click();
    cy.dataCy("dual-list-modal").should("exist");

    const itemToAdd =
      elementType === "host"
        ? `${element}.${Cypress.env("HOSTNAME")}`
        : element;

    addItemToRightList(itemToAdd);

    cy.dataCy("modal-button-add").click();
    cy.dataCy("dual-list-modal").should("not.exist");
    cy.dataCy("add-member-success").should("exist");

    findEntryInTable(itemToAdd, elementType);
    entryExists(itemToAdd);

    logout();
  }
);

Given(
  "I delete element {string} named {string} from netgroup {string}",
  (elementType: string, element: string, groupName: string) => {
    loginAsAdmin();
    navigateTo(`netgroups/${groupName}`);

    ensureTabVisibleAndOpen(elementType);

    const itemToDelete =
      elementType === "host"
        ? `${element}.${Cypress.env("HOSTNAME")}`
        : element;

    findEntryInTable(itemToDelete, elementType);
    entryExists(itemToDelete);
    checkEntry(itemToDelete);

    cy.dataCy(`settings-button-delete-${elementType}`).click();
    cy.dataCy("remove-netgroup-members-modal").should("exist");
    entryExists(itemToDelete);

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("remove-netgroup-members-modal").should("not.exist");
    cy.dataCy("remove-netgroups-success").should("exist");

    entryDoesNotExist(itemToDelete);

    logout();
  }
);

Given(
  "I have external host {string} in netgroup {string}",
  (externalHost: string, groupName: string) => {
    loginAsAdmin();
    navigateTo(`netgroups/${groupName}`);

    ensureTabVisibleAndOpen("externalhost");

    cy.dataCy("settings-button-add-externalHost").click();
    cy.dataCy("add-external-host-modal").should("exist");

    typeInTextbox("modal-textbox-external-host-name", externalHost);

    cy.dataCy("modal-button-add").click();
    cy.dataCy("add-external-host-modal").should("not.exist");
    cy.dataCy("add-member-success").should("exist");

    findEntryInTable(externalHost, "externalHost");
    entryExists(externalHost);

    logout();
  }
);

Given(
  "I delete external host {string} from netgroup {string}",
  (externalHost: string, groupName: string) => {
    loginAsAdmin();
    navigateTo(`netgroups/${groupName}`);

    ensureTabVisibleAndOpen("externalhost");

    findEntryInTable(externalHost, "externalHost");
    entryExists(externalHost);
    checkEntry(externalHost);

    cy.dataCy("settings-button-delete-externalHost").click();
    cy.dataCy("remove-netgroup-members-modal").should("exist");

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("remove-netgroup-members-modal").should("not.exist");
    cy.dataCy("remove-netgroups-success").should("exist");

    entryDoesNotExist(externalHost);

    logout();
  }
);
