import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I delete DNS forward zone {string}", (zoneName: string) => {
  cy.ipa({
    command: "dnsforwardzone-del",
    name: zoneName,
  });
});

Given(
  "DNS forward zone {string} exists with forwarder {string}",
  (zoneName: string, forwarder: string) => {
    cy.ipa({
      command: "dnsforwardzone-add",
      name: zoneName,
      specificOptions: `--forwarder ${forwarder}`,
    });
  }
);

Given("DNS forward zone {string} is disabled", (zoneName: string) => {
  cy.ipa({
    command: "dnsforwardzone-disable",
    name: zoneName,
  });
});

Given("DNS forward zone {string} is enabled", (zoneName: string) => {
  cy.ipa({
    command: "dnsforwardzone-enable",
    name: zoneName,
  });
});
