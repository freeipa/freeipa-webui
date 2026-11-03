import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given(
  "RADIUS server {string} exists with server {string} and secret {string}",
  (name: string, server: string, secret: string) => {
    cy.ipa({
      command: "radiusproxy-add",
      name: name,
      specificOptions: `--server="${server}" --secret`,
      stdin: secret,
    });
  }
);

Given(
  "RADIUS server {string} exists with server {string} secret {string} and description {string}",
  (name: string, server: string, secret: string, description: string) => {
    cy.ipa({
      command: "radiusproxy-add",
      name: name,
      specificOptions: `--server="${server}" --desc="${description}" --secret`,
      stdin: secret,
    });
  }
);

Given("I delete RADIUS server {string}", (name: string) => {
  cy.ipa({
    command: "radiusproxy-del",
    name: name,
  });
});
