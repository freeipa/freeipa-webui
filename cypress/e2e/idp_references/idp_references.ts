import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given(
  "IdP {string} exists with client {string} and scope {string}",
  (name: string, clientId: string, scope: string) => {
    cy.ipa({
      command: "idp-add",
      name: name,
      specificOptions: `--client-id=${clientId} --provider=keycloak --organization=myOrg --base-url=myOrg.example.test --scope=${scope} --idp-user-id=exampleAttributeKeycloak`,
    });
  }
);

Given(
  "IdP {string} exists with client {string} scope {string} and sub {string}",
  (name: string, clientId: string, scope: string, sub: string) => {
    const options =
      `--client-id=${clientId}` +
      ` --provider=keycloak` +
      ` --organization=myOrg` +
      ` --base-url=myOrg.example.test` +
      ` --scope=${scope}` +
      ` --idp-user-id=${sub}`;
    cy.ipa({
      command: "idp-add",
      name: name,
      specificOptions: options,
    });
  }
);

Given("I delete IdP {string}", (name: string) => {
  cy.ipa({
    command: "idp-del",
    name: name,
  });
});
