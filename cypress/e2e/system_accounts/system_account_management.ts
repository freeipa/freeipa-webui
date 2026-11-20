import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import { isElementDisabled, isElementEnabled } from "../common/data_tables";

const SYSACCOUNT_STATUS_LABEL = "nsaccountlock";

const isDisabled = (name: string) => {
  isElementDisabled(name, SYSACCOUNT_STATUS_LABEL);
};

const isEnabled = (name: string) => {
  isElementEnabled(name, SYSACCOUNT_STATUS_LABEL);
};

Then(
  "I should see {string} system account in the data table disabled",
  (name: string) => {
    isDisabled(name);
  }
);

Then(
  "I should see {string} system account in the data table enabled",
  (name: string) => {
    isEnabled(name);
  }
);

const createSysAccountExec = (
  accountId: string,
  password: string,
  description?: string
) => {
  cy.ipa({
    command: "sysaccount-add",
    name: accountId,
    specificOptions: "--password",
    stdin: password,
  });

  if (description) {
    cy.ipa({
      command: "sysaccount-mod",
      name: accountId,
      specificOptions: `--desc="${description}"`,
    });
  }
};

Given(
  "system account {string} exists with password {string}",
  (accountId: string, password: string) => {
    createSysAccountExec(accountId, password);
  }
);

Given(
  "system account {string} exists with password {string} and description {string}",
  (accountId: string, password: string, description: string) => {
    createSysAccountExec(accountId, password, description);
  }
);

Given(
  "disabled system account {string} exists with password {string}",
  (accountId: string, password: string) => {
    createSysAccountExec(accountId, password);
    cy.ipa({
      command: "sysaccount-disable",
      name: accountId,
    });
  }
);

Given("I delete system account {string}", (accountId: string) => {
  cy.ipa({
    command: "sysaccount-del",
    name: accountId,
  });
});

Given(
  "system account {string} is member of role {string}",
  (accountId: string, roleName: string) => {
    cy.ipa({
      command: "role-add-member",
      name: roleName,
      specificOptions: `--sysaccounts="${accountId}"`,
    });
  }
);

Given("role {string} exists", (roleName: string) => {
  cy.ipa({
    command: "role-add",
    name: roleName,
  });
});

Given("I delete role {string}", (roleName: string) => {
  cy.ipa({
    command: "role-del",
    name: roleName,
  });
});
