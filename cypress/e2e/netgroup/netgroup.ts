import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import { navigateTo } from "../common/navigation";
import {
  selectEntry,
  entryDoesNotExist,
  entryExists,
  checkEntry,
} from "../common/data_tables";
import { typeInTextbox } from "../common/ui/textbox";
import { findEntryInTable } from "../common/settings_table";
import { addItemToRightList } from "../common/ui/dual_list";
import { MemberEntity, assertMemberEntity } from "../common/member_of";
import { searchForMembersEntry } from "../common/members_table";

Given("netgroup {string} exists", (groupName: string) => {
  loginAsAdmin();
  navigateTo("netgroups");

  cy.dataCy("netgroups-button-add").click();
  cy.dataCy("add-netgroup-modal").should("exist");

  typeInTextbox("modal-textbox-netgroup-name", groupName);
  cy.dataCy("modal-textbox-netgroup-name").should("have.value", groupName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-netgroup-modal").should("not.exist");
  cy.dataCy("add-netgroup-success").should("exist");

  searchForMembersEntry(groupName);
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
  cy.dataCy("remove-netgroups-success").should("exist");

  searchForMembersEntry(groupName);
  entryDoesNotExist(groupName);
  logout();
});

const ensureTabVisibleAndOpen = (elementType: MemberEntity) => {
  const tabDataCy = `netgroups-tab-settings-tab-${elementType}s`;
  cy.dataCy(tabDataCy).click();
};

Given(
  "I have element {string} named {string} in netgroup {string}",
  (elementType: string, element: string, groupName: string) => {
    loginAsAdmin();
    navigateTo(`netgroups/${groupName}`);

    assertMemberEntity(elementType);
    ensureTabVisibleAndOpen(elementType as MemberEntity);

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
  "I delete element {string} named {string} from netgroup {string}",
  (elementType: string, element: string, groupName: string) => {
    loginAsAdmin();
    navigateTo(`netgroups/${groupName}`);

    assertMemberEntity(elementType);
    ensureTabVisibleAndOpen(elementType as MemberEntity);

    findEntryInTable(element, elementType);
    entryExists(element);
    checkEntry(element);

    cy.dataCy(`settings-button-delete-${elementType}`).click();
    cy.dataCy("remove-netgroup-members-modal").should("exist");
    entryExists(element);

    cy.dataCy("modal-button-delete").click();
    cy.dataCy("remove-netgroup-members-modal").should("not.exist");
    cy.dataCy("remove-netgroups-success").should("exist");

    entryDoesNotExist(element);

    logout();
  }
);

Given(
  "I have external host {string} in netgroup {string}",
  (externalHost: string, groupName: string) => {
    loginAsAdmin();
    navigateTo(`netgroups/${groupName}`);

    assertMemberEntity("externalhost");
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

    assertMemberEntity("externalhost");
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
