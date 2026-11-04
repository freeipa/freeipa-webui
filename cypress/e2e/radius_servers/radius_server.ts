import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { IPA_PREFIX_INTERACTIVE } from "cypress/support/utils";

Given(
  "RADIUS server {string} exists with server {string} and secret {string}",
  (name: string, server: string, secret: string) => {
    cy.ipa({
      command: "radiusproxy-del",
      name: name,
      options: { failOnNonZeroExit: false },
    });
    const ipaCmd = `${IPA_PREFIX_INTERACTIVE} radiusproxy-add "${name}" --server="${server}" --secret`;
    cy.exec(`echo "${secret}" | ${ipaCmd}`);
  }
);

Given(
  "RADIUS server {string} exists with server {string} secret {string} and description {string}",
  (name: string, server: string, secret: string, description: string) => {
    cy.ipa({
      command: "radiusproxy-del",
      name: name,
      options: { failOnNonZeroExit: false },
    });
    const ipaCmd = `${IPA_PREFIX_INTERACTIVE} radiusproxy-add "${name}" --server="${server}" --desc="${description}" --secret`;
    cy.exec(`echo "${secret}" | ${ipaCmd}`);
  }
);

Given("I delete RADIUS server {string}", (name: string) => {
  cy.ipa({
    command: "radiusproxy-del",
    name: name,
    options: { failOnNonZeroExit: false },
  });
});
