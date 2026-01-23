import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import { searchForEntry, entryExists } from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { selectOption } from "../common/ui/select";
import { isOptionSelected } from "../common/ui/select";

const createUserGroupExec = (groupName: string) => {
  cy.ipa({
    command: "group-add",
    name: groupName,
  });
};

Given("I delete user group {string}", (groupName: string) => {
  cy.ipa({
    command: "group-del",
    name: groupName,
  });
});

Given("user group {string} exists", (groupName: string) => {
  createUserGroupExec(groupName);
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
  switch (type) {
    case "member_user":
      cy.ipa({
        command: "group-add-member",
        name: group,
        specificOptions: `--users=${member}`,
      });
      break;
    case "member_group":
      cy.ipa({
        command: "group-add-member",
        name: group,
        specificOptions: `--groups=${member}`,
      });
      break;
    case "member_service":
      cy.ipa({
        command: "group-add-member",
        name: group,
        specificOptions: `--services=${member}`,
      });
      break;
    case "manager_user":
      cy.ipa({
        command: "group-add-member-manager",
        name: group,
        specificOptions: `--users=${member}`,
      });
      break;
    case "manager_group":
      cy.ipa({
        command: "group-add-member-manager",
        name: group,
        specificOptions: `--groups=${member}`,
      });
      break;
    case "memberof_usergroup":
      cy.ipa({
        command: "group-add-member",
        name: member,
        specificOptions: `--groups=${group}`,
      });
      break;
    case "memberof_netgroup":
      cy.ipa({
        command: "netgroup-add-member",
        name: member,
        specificOptions: `--groups=${group}`,
      });
      break;
    case "memberof_role":
      cy.ipa({
        command: "role-add-member",
        name: member,
        specificOptions: `--groups=${group}`,
      });
      break;
    case "memberof_hbacrule":
      cy.ipa({
        command: "hbacrule-add-user",
        name: member,
        specificOptions: `--groups=${group}`,
      });
      break;
    case "memberof_sudorule":
      cy.ipa({
        command: "sudorule-add-user",
        name: member,
        specificOptions: `--groups=${group}`,
      });
      break;
  }
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
