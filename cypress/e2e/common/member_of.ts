import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "./authentication";
import { navigateTo } from "./navigation";
import { searchForEntry, entryExists } from "./data_tables";
import { addItemToRightList } from "./ui/dual_list";
import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";

export const ensureItemExistsInMemberOfTable = (
  itemName: string,
  tablePath: string,
  useDualListSearchLink: boolean = false
) => {
  loginAsAdmin();
  navigateTo(`netgroups/${tablePath}`);

  cy.dataCy("member-of-button-add").click();
  cy.dataCy("member-of-add-modal").should("exist");

  if (useDualListSearchLink) {
    cy.dataCy("dual-list-search-link").click();
  }

  addItemToRightList(itemName);
  cy.dataCy("member-of-add-modal").should("exist");

  cy.dataCy("modal-button-add").click();
  cy.dataCy("member-of-add-modal").should("not.exist");
  cy.dataCy("add-member-success").should("exist");

  searchForEntry(itemName);
  entryExists(itemName);

  logout();
};

// Register a parameter type that supports multi-word kinds like "user group"
defineParameterType({
  name: "memberEntity",
  // Ensure longer alternative first so "user group" doesn't get swallowed by "user"
  regexp: /user group|hostgroup|host|user|netgroup/,
  transformer: (s: string) => s,
});

// Replace multiple specific step variants with a single generic one
Given(
  "{memberEntity} {string} exists in table {string}",
  (_entity: string, name: string, table: string) => {
    ensureItemExistsInMemberOfTable(name, table);
  }
);

Given(
  "{memberEntity} {string} exists in table {string} using dual list search",
  (_entity: string, name: string, table: string) => {
    ensureItemExistsInMemberOfTable(name, table, true);
  }
);
