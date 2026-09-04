import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("permission {string} exists", (permissionName: string) => {
  cy.ipa({
    command: "permission-add",
    name: permissionName,
    specificOptions:
      "--bindtype=permission --right=read --type=user --attrs=uid",
  });
});

Given(
  "permission {string} is member of privilege {string}",
  (permissionName: string, privilegeName: string) => {
    cy.ipa({
      command: "privilege-add-permission",
      name: privilegeName,
      specificOptions: `--permissions="${permissionName}"`,
    });
  }
);

Given("I delete permission {string}", (permissionName: string) => {
  cy.ipa({
    command: "permission-del",
    name: permissionName,
  });
});
