import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import { navigateTo } from "../common/navigation";
import { entryExists, searchForEntry } from "../common/data_tables";
import { createHostgroup } from "../hostgroups/hostgroup";
import { createHostgroupRule } from "./automember_hostgroup";
import { createUserGroupRule } from "./automember_user_group";
import { isOptionSelected } from "../common/ui/select";
import { typeInTextbox } from "../common/ui/textbox";
import { createUserGroup } from "../user_groups/user_groups";
import { EntryType } from "./parameter_types";

const addEntryTableToGroupRule = (
  entryType: EntryType,
  entry: string,
  category: string
) => {
  cy.dataCy("settings-button-add-automember" + entryType + "regex").click();
  cy.dataCy("add-automember-condition-modal").should("exist");

  cy.dataCy("modal-attribute-select-toggle").click();
  cy.dataCy("modal-attribute-select-toggle").should(
    "have.attr",
    "aria-expanded",
    "true"
  );
  cy.dataCy("modal-attribute-select-" + category).click();
  isOptionSelected(category, "modal-attribute-select");

  typeInTextbox("modal-textbox-expression", entry);
  cy.dataCy("modal-textbox-expression").should("have.value", entry);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-automember-condition-success").should("exist");

  cy.get("#automember" + entryType + "regex-table")
    .find("td")
    .contains(entry)
    .should("exist");
};

Given(
  "hostgroup rule {string} exists and has {EntryType} entry {string} with category {string}",
  (
    hostGroupName: string,
    entryType: EntryType,
    entry: string,
    category: string
  ) => {
    loginAsAdmin();
    navigateTo("host-groups");

    createHostgroup(hostGroupName, "test");
    searchForEntry(hostGroupName);
    entryExists(hostGroupName);

    navigateTo("host-group-rules");
    createHostgroupRule(hostGroupName);

    searchForEntry(hostGroupName);
    entryExists(hostGroupName);

    navigateTo("host-group-rules/" + hostGroupName);
    addEntryTableToGroupRule(entryType, entry, category);
    logout();
  }
);

Given(
  "user group rule {string} exists and has {EntryType} entry {string} with category {string}",
  (
    userGroupName: string,
    entryType: EntryType,
    entry: string,
    category: string
  ) => {
    loginAsAdmin();
    navigateTo("user-groups");

    createUserGroup(userGroupName);

    navigateTo("user-group-rules");
    createUserGroupRule(userGroupName);

    searchForEntry(userGroupName);
    entryExists(userGroupName);

    navigateTo("user-group-rules/" + userGroupName);
    addEntryTableToGroupRule(entryType, entry, category);
    logout();
  }
);
