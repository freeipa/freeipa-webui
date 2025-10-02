import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "./authentication";
import { navigateTo } from "./navigation";
import { searchForEntry, entryExists } from "./data_tables";
import { addItemToRightList } from "./ui/dual_list";

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

export type MemberEntity =
  | "user group"
  | "hostgroup"
  | "host"
  | "user"
  | "netgroup"
  | "externalhost"
  | "group";

const validMemberEntities: MemberEntity[] = [
  "user group",
  "hostgroup",
  "host",
  "user",
  "netgroup",
];

export const isMemberEntity = (value: string): value is MemberEntity => {
  return (validMemberEntities as readonly string[]).includes(value);
};

Given(
  "{string} {string} exists in table {string}",
  (entity: string, name: string, table: string) => {
    if (!isMemberEntity(entity)) {
      throw new Error(`Invalid member entity: ${entity}`);
    }
    ensureItemExistsInMemberOfTable(name, table);
  }
);

Given(
  "{string} {string} exists in table {string} using dual list search",
  (entity: string, name: string, table: string) => {
    if (!isMemberEntity(entity)) {
      throw new Error(`Invalid member entity: ${entity}`);
    }
    ensureItemExistsInMemberOfTable(name, table, true);
  }
);
