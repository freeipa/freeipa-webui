import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

import { loginAsAdmin, logout } from "../common/authentication";
import { extractOTPSecret, generateOTP, getTokenPeriodInMs } from "./otp";

// Used for the When and Then step of otp, as we need ensure the same token is used for both of these steps
let otpToken: string;

Given("User {string} has OTP enabled", (login: string) => {
  loginAsAdmin();

  cy.visit(Cypress.env("BASE_URL") + "/active-users/" + login);

  cy.dataCy("user-tab-settings-checkbox-ipauserauthtype-otp").check();
  cy.dataCy("user-tab-settings-checkbox-ipauserauthtype-otp").should(
    "be.checked"
  );

  cy.dataCy("user-tab-settings-kebab").click();
  cy.dataCy("user-tab-settings-kebab-add-otp-token").click();
  cy.dataCy("add-otp-token-modal").should("exist");

  cy.dataCy("modal-textbox-clock-interval").type("5");
  cy.dataCy("modal-textbox-clock-interval").should("have.value", "5");

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-otp-token-modal").should("not.exist");

  cy.dataCy("configure-your-token-modal").should("exist");
  cy.dataCy("qr-code-link").should("exist");

  cy.dataCy("qr-code-link")
    .invoke("attr", "href")
    .then((qrCodeLink) => generateOTP(extractOTPSecret(qrCodeLink)));

  cy.dataCy("modal-button-ok").click();
  cy.dataCy("configure-your-token-modal").should("not.exist");

  cy.dataCy("user-tab-settings-button-save").click();
  cy.dataCy("user-tab-settings-button-save").should("be.disabled");

  logout();
});

When("I type in the {string} textbox text otp token", (textbox: string) => {
  cy.wait(getTokenPeriodInMs());

  otpToken = generateOTP();

  cy.dataCy(textbox).clear();
  cy.dataCy(textbox).should("have.value", "");
  cy.dataCy(textbox).type(otpToken);
});

Then("I should see otp token in the {string} textbox", (textbox: string) => {
  cy.dataCy(textbox).should("have.value", otpToken);
});

When(
  "I log in as {string} with password {string} and generated OTP",
  (username: string, password: string) => {
    cy.visit(Cypress.env("BASE_URL") + "/login");

    cy.get("#pf-login-username-id").type(username);
    cy.get("#pf-login-username-id").should("have.value", username);

    cy.wait(getTokenPeriodInMs());

    otpToken = generateOTP();

    cy.get("#pf-login-password-id").type(password + otpToken);
    cy.get("#pf-login-password-id").should("have.value", password + otpToken);

    cy.get("button[type='submit']").click();
  }
);
