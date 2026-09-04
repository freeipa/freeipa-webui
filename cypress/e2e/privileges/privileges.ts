import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("privilege {string} exists", (privilegeName: string) => {
  cy.ipa({
    command: "privilege-add",
    name: privilegeName,
  });
});

Given(
  "privilege {string} exists with description {string}",
  (privilegeName: string, description: string) => {
    cy.ipa({
      command: "privilege-add",
      name: privilegeName,
      specificOptions: `--desc="${description}"`,
    });
  }
);

Given("I delete privilege {string}", (privilegeName: string) => {
  cy.ipa({
    command: "privilege-del",
    name: privilegeName,
  });
});
