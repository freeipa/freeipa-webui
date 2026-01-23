import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("HBAC service group {string} exists", (groupName: string) => {
  cy.ipa({
    command: "hbacsvcgroup-add",
    name: groupName,
  });
});

Given("I delete service group {string}", (groupName: string) => {
  cy.ipa({
    command: "hbacsvcgroup-del",
    name: groupName,
  });
});

Given(
  "I add service group member {string} to service group {string}",
  (serviceName: string, groupName: string) => {
    cy.ipa({
      command: "hbacsvcgroup-add-member",
      name: groupName,
      specificOptions: `--hbacsvcs=${serviceName}`,
    });
  }
);

Given(
  "I delete service group member {string} from service group {string}",
  (serviceName: string, groupName: string) => {
    cy.ipa({
      command: "hbacsvcgroup-remove-member",
      name: groupName,
      specificOptions: `--hbacsvcs=${serviceName}`,
    });
  }
);
