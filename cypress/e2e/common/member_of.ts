import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "./authentication";
import { navigateTo } from "./navigation";
import { entryExists } from "./data_tables";
import { addItemToRightList } from "./ui/dual_list";
import { searchForMembersEntry } from "./members_table";

const ensureItemExistsInMemberOfTable = (
  itemName: string,
  tablePath: string,
  useDualListSearchLink: boolean = false
) => {
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

  searchForMembersEntry(itemName);
  entryExists(itemName);
};

// Allowed member entity values (readonly tuple)
const MEMBER_ENTITIES = [
  "user group",
  "hostgroup",
  "host",
  "user",
  "netgroup",
  "externalhost",
  "group",
] as const;

export type MemberEntity = (typeof MEMBER_ENTITIES)[number];

export const isMemberEntity = (value: string): value is MemberEntity => {
  return MEMBER_ENTITIES.includes(value as MemberEntity);
};

export const assertMemberEntity = (value: string): void => {
  if (!isMemberEntity(value)) {
    throw new Error(`Invalid member entity: ${value}`);
  }
};

Given("{string} exists in table {string}", (name: string, table: string) => {
  loginAsAdmin();
  ensureItemExistsInMemberOfTable(name, table);
  logout();
});
