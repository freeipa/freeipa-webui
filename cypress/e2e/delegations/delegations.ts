import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

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

When(
  "I click on {string} entry in the data table",
  (name: string) => {
    cy.get("tr[id='" + name + "']").find("a").click();
  }
);

Then(
  "I should see {string} text on the page",
  (text: string) => {
    cy.contains(text).should("be.visible");
  }
);

When("I click on the {string} breadcrumb link", (linkText: string) => {
  cy.get(".pf-v6-c-breadcrumb__link").contains(linkText).click();
});
