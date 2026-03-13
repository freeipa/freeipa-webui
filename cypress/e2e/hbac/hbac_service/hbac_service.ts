import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("HBAC service {string} exists", (serviceName: string) => {
  cy.ipa({
    command: "hbacsvc-add",
    name: serviceName,
  });
});

Given("I delete service {string}", (serviceName: string) => {
  cy.ipa({
    command: "hbacsvc-del",
    name: serviceName,
  });
});

Given(
  "I add service group member {string} to service {string}",
  (groupName: string, serviceName: string) => {
    cy.ipa({
      command: "hbacsvcgroup-add-member",
      name: groupName,
      specificOptions: `--hbacsvcs=${serviceName}`,
    });
  }
);

Given(
  "I delete service group member {string} from service {string}",
  (groupName: string, serviceName: string) => {
    cy.ipa({
      command: "hbacsvcgroup-remove-member",
      name: groupName,
      specificOptions: `--hbacsvcs=${serviceName}`,
    });
  }
);
