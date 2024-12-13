import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I click the help button", () => {
  cy.get("button").contains("Help").click();
});

Then("I should see contextual help panel", () => {
  cy.get("div[class='pf-v5-c-drawer__panel'").should("be.visible");
});

Then("I should see a title {string} in the panel", (title: string) => {
  cy.get("div[class='pf-v5-c-drawer__head'")
    .find("h2")
    .contains(title)
    .should("be.visible");
});

Then("I should see a list of links", () => {
  cy.get("ul").should("be.visible");
});

When("I click on close button in the panel", () => {
  cy.get("button[aria-label='Close drawer panel']").click();
});

Then("I should not see contextual help panel", () => {
  cy.get("div[class='pf-v5-c-drawer__panel']").should("be.hidden");
});
