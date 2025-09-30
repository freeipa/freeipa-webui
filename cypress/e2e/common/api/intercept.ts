import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I intercept the {string} API call", (apiMethodName: string) => {
  cy.intercept({ method: "POST", url: "**/ipa/session/json" }, (req) => {
    if (req.body.method === apiMethodName) {
      req.alias = "apiCall";
    }
  });
});

Then("I should wait for the API call to finish", () => {
  cy.wait("@apiCall");
});
