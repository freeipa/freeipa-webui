import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("role {string} exists", (roleName: string) => {
  cy.ipa({
    command: "role-add",
    name: roleName,
  });
});

Given(
  "role {string} exists with description {string}",
  (roleName: string, description: string) => {
    cy.ipa({
      command: "role-add",
      name: roleName,
      specificOptions: `--desc="${description}"`,
    });
  }
);

Given("I delete role {string}", (roleName: string) => {
  cy.ipa({
    command: "role-del",
    name: roleName,
  });
});

Given(
  "privilege {string} is member of role {string}",
  (privilegeName: string, roleName: string) => {
    cy.ipa({
      command: "role-add-privilege",
      name: roleName,
      specificOptions: `--privileges="${privilegeName}"`,
    });
  }
);

Given(
  "user {string} is member of role {string}",
  (userName: string, roleName: string) => {
    cy.ipa({
      command: "role-add-member",
      name: roleName,
      specificOptions: `--users="${userName}"`,
    });
  }
);

Given(
  "user group {string} is member of role {string}",
  (groupName: string, roleName: string) => {
    cy.ipa({
      command: "role-add-member",
      name: roleName,
      specificOptions: `--groups="${groupName}"`,
    });
  }
);

Given(
  "host {string} is member of role {string}",
  (hostName: string, roleName: string) => {
    cy.ipa({
      command: "role-add-member",
      name: roleName,
      specificOptions: `--hosts="${hostName}"`,
    });
  }
);

Given(
  "host group {string} is member of role {string}",
  (hostGroupName: string, roleName: string) => {
    cy.ipa({
      command: "role-add-member",
      name: roleName,
      specificOptions: `--hostgroups="${hostGroupName}"`,
    });
  }
);

Given(
  "service {string} is member of role {string}",
  (serviceName: string, roleName: string) => {
    cy.ipa({
      command: "role-add-member",
      name: roleName,
      specificOptions: `--services="${serviceName}"`,
    });
  }
);
