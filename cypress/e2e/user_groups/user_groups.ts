import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  selectEntry,
  searchForEntry,
  entryDoesNotExist,
  entryExists,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { selectOption } from "../common/ui/select";
import { isOptionSelected } from "../common/ui/select";
import { addItemToRightList } from "../common/ui/dual_list";

export const createUserGroup = (groupName: string) => {
  cy.dataCy("user-groups-button-add").click();
  cy.dataCy("add-user-group-modal").should("exist");

  cy.dataCy("modal-textbox-group-name").type(groupName);
  cy.dataCy("modal-textbox-group-name").should("have.value", groupName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-user-group-modal").should("not.exist");
  searchForEntry(groupName);
  entryExists(groupName);
};

Given("I delete user group {string}", (groupName: string) => {
  loginAsAdmin();
  navigateTo("user-groups");
  selectEntry(groupName);

  cy.dataCy("user-groups-button-delete").click();
  cy.dataCy("delete-user-groups-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-user-groups-modal").should("not.exist");

  searchForEntry(groupName);
  entryDoesNotExist(groupName);
  logout();
});

Given("user group {string} exists", (groupName: string) => {
  loginAsAdmin();
  navigateTo("user-groups");

  createUserGroup(groupName);
  logout();
});

type MemberType = "member_user" | "member_group" | "member_service";

type MemberOfType =
  | "memberof_usergroup"
  | "memberof_netgroup"
  | "memberof_role"
  | "memberof_hbacrule"
  | "memberof_sudorule";

type ManagerType = "manager_user" | "manager_group";

const addMember = (
  type: MemberType | MemberOfType | ManagerType,
  member: string,
  group: string
) => {
  loginAsAdmin();
  navigateTo("user-groups/" + group + "/" + type);

  cy.dataCy("member-of-button-add").click();
  cy.dataCy("member-of-add-modal").should("exist");

  addItemToRightList(member);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("member-of-add-modal").should("not.exist");

  searchForEntry(member);
  entryExists(member);
  logout();
};

Given(
  "user {string} is member of group {string}",
  (user: string, group: string) => {
    addMember("member_user", user, group);
  }
);

Given(
  "user group {string} is member of group {string}",
  (userGroup: string, group: string) => {
    addMember("member_group", userGroup, group);
  }
);

Given(
  "service {string} is member of group {string}",
  (service: string, group: string) => {
    addMember("member_service", service, group);
  }
);

Given(
  "user {string} is manager of group {string}",
  (user: string, group: string) => {
    addMember("manager_user", user, group);
  }
);

Given(
  "user group {string} is manager of group {string}",
  (userGroup: string, group: string) => {
    addMember("manager_group", userGroup, group);
  }
);

Given(
  "user group {string} is member of role {string}",
  (group: string, role: string) => {
    addMember("memberof_role", role, group);
  }
);

Given(
  "user group {string} is member of hbac rule {string}",
  (group: string, hbacRule: string) => {
    addMember("memberof_hbacrule", hbacRule, group);
  }
);

Given("non-POSIX User group {string} exists", (groupName: string) => {
  loginAsAdmin();
  navigateTo("user-groups");

  cy.dataCy("user-groups-button-add").click();
  cy.dataCy("add-user-group-modal").should("exist");

  cy.dataCy("modal-textbox-group-name").type(groupName);
  cy.dataCy("modal-textbox-group-name").should("have.value", groupName);

  selectOption("non-posix", "modal-group-type-select");
  isOptionSelected("non-posix", "modal-group-type-select");

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-user-group-modal").should("not.exist");
  searchForEntry(groupName);
  entryExists(groupName);
  logout();
});
