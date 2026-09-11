import { Given } from "@badeball/cypress-cucumber-preprocessor";

type DelegationSeedOptions = {
  permissions?: string;
  group?: string;
  memberGroup?: string;
};

const delegationAddOptions = ({
  permissions = "write",
  group = "ipausers",
  memberGroup = "ipausers",
}: DelegationSeedOptions = {}) =>
  `--attrs=cn --group=${group} --membergroup=${memberGroup} --permissions=${permissions}`;

Given("delegation {string} exists", (delegationName: string) => {
  cy.ipa({
    command: "delegation-add",
    name: delegationName,
    specificOptions: delegationAddOptions(),
  });
});

Given(
  "delegation {string} exists with group {string} and member group {string}",
  (delegationName: string, group: string, memberGroup: string) => {
    cy.ipa({
      command: "delegation-add",
      name: delegationName,
      specificOptions: delegationAddOptions({ group, memberGroup }),
    });
  }
);

Given("I delete delegation {string}", (delegationName: string) => {
  cy.ipa({
    command: "delegation-del",
    name: delegationName,
  });
});
