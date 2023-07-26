import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I am on login page", () => {
  // temporary solution as the new UI doesn't have login page yet
  cy.visit("/ipa/ui");
});

Given(
  "an administrator account named {word} exists",
  (admin_account_exists) => {
    console.log("Admin exists, SUCCESS");
    //   TODO: implement
  }
);

When("I log in as {string} with password {string}", (loginName, password) => {
  // temporary solution as the new UI doesn't have login page yet
  cy.get("[id=username1]").type(loginName);
  cy.get("[id=password2").type(password);
  cy.get("button[name=login]").click();
  cy.wait(1000);
  cy.visit("/ipa/modern_ui");
});

When("I logout", () => {});

When("I open the side menu", () => {
  cy.get('[id="nav-toggle"]').then(($ele) => {
    if ($ele.attr("aria-expanded") === "false") {
      $ele.click();
    }
  });
});

When("I close the side menu", () => {
  cy.get('[id="nav-toggle"]').then(($ele) => {
    if ($ele.attr("aria-expanded") === "true") {
      $ele.click();
    }
  });
});
When("I click on {string} tab", (tabText) => {
  cy.get("nav a").contains(tabText).click();
});

When("I click on {string} button", function (buttonText) {
  cy.wait(1000);
  cy.get("button").contains(buttonText).click();
});

When("in the modal dialog I click on {string} button", function (buttonText) {
  cy.get("[role=dialog] button").contains(buttonText).click();
});

When("I type in the field {string} text {string}", (fieldName, content) => {
  cy.get("[role=dialog] label")
    .contains(fieldName)
    .parent()
    .then(($label) => {
      cy.get("[name=modal-form-" + $label.attr("for") + "]").type(content);
    });
});

Then("I should see {string} entry in the data table", (name) => {
  cy.get("tr[id=" + name + "]").should("be.visible");
});
