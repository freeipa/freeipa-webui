import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("sudo command group {string} exists", (groupName: string) => {
  cy.ipa({
    command: "sudocmdgroup-del",
    name: groupName,
    options: { failOnNonZeroExit: false },
  });
  cy.ipa({
    command: "sudocmdgroup-add",
    name: groupName,
  });
});

Given(
  "sudo command group {string} with description {string} exists",
  (groupName: string, description: string) => {
    cy.ipa({
      command: "sudocmdgroup-del",
      name: groupName,
      options: { failOnNonZeroExit: false },
    });
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
    options: { failOnNonZeroExit: false },
  });
});

Given("sudo command {string} exists", (cmdName: string) => {
  cy.ipa({
    command: "sudocmd-del",
    name: cmdName,
    options: { failOnNonZeroExit: false },
  });
  cy.ipa({
    command: "sudocmd-add",
    name: cmdName,
  });
});

Given("I delete sudo command {string}", (cmdName: string) => {
  cy.ipa({
    command: "sudocmd-del",
    name: cmdName,
    options: { failOnNonZeroExit: false },
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
      options: { failOnNonZeroExit: false },
    });
  }
);
