import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("privilege {string} exists", (privilegeName: string) => {
  cy.ipa({
    command: "privilege-add",
    name: privilegeName,
  });
});

Given("I delete privilege {string}", (privilegeName: string) => {
  cy.ipa({
    command: "privilege-del",
    name: privilegeName,
  });
});
