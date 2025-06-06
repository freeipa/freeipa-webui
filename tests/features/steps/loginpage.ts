import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I type in the username {string}", (username: string) => {
  cy.get("#pf-login-username-id").type(username);
});

When("I type in the password {string}", (password: string) => {
  cy.get("#pf-login-password-id").type(password);
});

When(
  "I log in as {string} with password {string} and generated OTP",
  (username: string, password: string) => {
    cy.visit(Cypress.env("login_url"));
    cy.get("#pf-login-username-id").type(username);
    // workaround to force cypress-otp to generate a new valid token\
    // https://github.com/NoriSte/cypress-otp/issues/62
    cy.wait(30000);
    cy.task<string>("generateOTP").then((token) => {
      cy.get("#pf-login-password-id").type(password + token);
    });
    cy.get("button").contains("Log in").click();
  }
);

Then("I should see the login dialog with title {string}", (title: string) => {
  cy.get("div.pf-v5-c-login__container h2").contains(title);
});

When(
  "In the login dialog I type in the field {string} text {string}",
  (fieldName: string, content: string) => {
    const regex = new RegExp("^" + fieldName + "$", "i");
    cy.get("label")
      .contains(regex)
      .parent()
      .then(($label) => {
        cy.get("#" + $label.attr("for")).type(content);
      });
  }
);

When(
  "In the login dialog I type in the field {string} current OTP token",
  (fieldName: string) => {
    const regex = new RegExp("^" + fieldName + "$", "i");
    cy.get("label")
      .contains(regex)
      .parent()
      .then(($label) => {
        cy.task<string>("generateOTP").then((token) => {
          cy.get("#" + $label.attr("for")).type(token);
        });
      });
  }
);

When("I click on a link with text {string}", (linkTitle: string) => {
  cy.get("a").contains(linkTitle).click();
});
