import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { IPA_PREFIX } from "../../support/utils";

Given(
  "OTP token {string} exists for user {string} with type {string} and description {string}",
  (tokenId: string, owner: string, type: string, description: string) => {
    cy.ipa({
      command: "otptoken-add",
      name: tokenId,
      specificOptions: `--owner="${owner}" --desc="${description}" --type=${type}`,
    });
  }
);

Given(
  "an OTP token exists for user {string} with type {string} and description {string}",
  (owner: string, type: string, description: string) => {
    cy.exec(
      `${IPA_PREFIX} otptoken-add --owner="${owner}" --desc="${description}" --type=${type}`
    );
  }
);

Given("I delete OTP token {string}", (tokenId: string) => {
  cy.ipa({
    command: "otptoken-del",
    name: tokenId,
  });
});

Given("I delete OTP token with description {string}", (description: string) => {
  cy.exec(`${IPA_PREFIX} otptoken-find --desc="${description}" --raw`, {
    failOnNonZeroExit: false,
  }).then((result) => {
    const match = result.stdout.match(/ipatokenuniqueid:\s*(\S+)/);
    if (match) {
      cy.ipa({
        command: "otptoken-del",
        name: match[1],
      });
    }
  });
});

Given("OTP token {string} is disabled", (tokenId: string) => {
  cy.ipa({
    command: "otptoken-mod",
    name: tokenId,
    specificOptions: "--disabled=TRUE",
  });
});

Given(
  "user {string} is manager of OTP token {string}",
  (userName: string, tokenId: string) => {
    cy.ipa({
      command: "otptoken-add-managedby",
      name: tokenId,
      specificOptions: `--users="${userName}"`,
    });
  }
);
