import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("DNS zone {string} is enabled", (dnsZoneName: string) => {
  cy.ipa({
    command: "dnszone-enable",
    name: dnsZoneName,
  }).then((result) => {
    cy.log(result.stderr);
    cy.log(result.stdout);
  });
});

Given("DNS zone {string} is disabled", (dnsZoneName: string) => {
  cy.ipa({
    command: "dnszone-disable",
    name: dnsZoneName,
  }).then((result) => {
    cy.log(result.stderr);
    cy.log(result.stdout);
  });
});

Given("DNS zone {string} has permission", (dnsZoneName: string) => {
  cy.ipa({
    command: "dnszone-add-permission",
    name: dnsZoneName,
  }).then((result) => {
    cy.log(result.stderr);
    cy.log(result.stdout);
  });
});
