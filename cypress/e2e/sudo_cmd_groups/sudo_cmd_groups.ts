import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import { searchForEntry } from "../common/data_tables";

Given("sudo command group {string} exists", (groupName: string) => {
  cy.ipa({
    command: "sudocmdgroup-add",
    name: groupName,
  });
});

Given(
  "sudo command group {string} with description {string} exists",
  (groupName: string, description: string) => {
    cy.ipa({
      command: "sudocmdgroup-add",
      name: groupName,
      specificOptions: `--desc="${description}"`,
    });
  }
);

Given("I delete sudo command group {string}", (groupName: string) => {
  cy.ipa({
    command: "sudocmdgroup-del",
    name: groupName,
  });
});

Given("sudo command {string} exists", (cmdName: string) => {
  cy.ipa({
    command: "sudocmd-add",
    name: cmdName,
  });
});

Given("I delete sudo command {string}", (cmdName: string) => {
  cy.ipa({
    command: "sudocmd-del",
    name: cmdName,
  });
});

Given(
  "I add sudo command {string} to sudo command group {string}",
  (cmdName: string, groupName: string) => {
    cy.ipa({
      command: "sudocmdgroup-add-member",
      name: groupName,
      specificOptions: `--sudocmds="${cmdName}"`,
    });
  }
);

Given(
  "I remove sudo command {string} from sudo command group {string}",
  (cmdName: string, groupName: string) => {
    cy.ipa({
      command: "sudocmdgroup-remove-member",
      name: groupName,
      specificOptions: `--sudocmds="${cmdName}"`,
    });
  }
);

Given("I am on the sudo command {string} settings page", (cmdName: string) => {
  cy.visit(Cypress.env("BASE_URL") + "/sudo-commands");
  searchForEntry(cmdName);
  cy.get("tr[id='" + cmdName + "'] a").click();
});

When("I click on the breadcrumb link {string}", (linkText: string) => {
  cy.get(".pf-v6-c-breadcrumb__link").contains(linkText).click();
});

When("I click on the {string} tab", (tabName: string) => {
  cy.get(`[name='${tabName}']`).click();
});
