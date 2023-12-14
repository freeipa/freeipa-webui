import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

// navigation
Given("I am on {string} page", (handle: string) => {
  cy.url().then(($url) => {
    if (!$url.includes(handle)) {
      cy.visit(Cypress.env("base_url") + "/" + handle);
    }
  });
});

// login
Given("I am logged in as {string}", (username: string) => {
  cy.url().then(($url) => {
    if (!$url.includes("modern_ui")) {
      cy.loginAsAnUser(
        Cypress.env("admin_login"),
        Cypress.env("admin_password")
      );
    }
  });
  cy.get(
    "div.pf-v5-c-masthead__content button span.pf-v5-c-dropdown__toggle-text"
  ).then(($ele) => {
    if ($ele.text() != username) {
      cy.loginAsAnUser(
        Cypress.env("admin_login"),
        Cypress.env("admin_password")
      );
    }
  });
});

When(
  "I log in as {string} with password {string}",
  (username: string, password: string) => {
    cy.loginAsAnUser(username, password);
  }
);

When("I logout", () => {});

// Side menu
When("I open the side menu", () => {
  cy.get('[id="nav-toggle"]').then(($ele) => {
    if ($ele.attr("aria-expanded") === "false") {
      $ele.trigger("click");
    }
  });
});

When("I close the side menu", () => {
  cy.get('[id="nav-toggle"]').then(($ele) => {
    if ($ele.attr("aria-expanded") === "true") {
      $ele.trigger("click");
    }
  });
});

// Buttons and tabs
When("I click on {string} tab", (tabText: string) => {
  cy.get("nav a").contains(tabText).click();
});

When("I click on {string} button", function (buttonText: string) {
  cy.get("button").contains(buttonText).click();
});

Then("button {string} should be enabled", function (buttonText: string) {
  cy.get("button").contains(buttonText).should("be.enabled");
});

Then("button {string} should be disabled", function (buttonText: string) {
  cy.get("button").contains(buttonText).should("be.disabled");
});

// Modals
When(
  "in the modal dialog I click on {string} button",
  function (buttonText: string) {
    cy.get("[role=dialog] button").contains(buttonText).click();
    cy.wait(1000);
  }
);

When(
  "in the modal dialog I check {string} radio selector",
  (selectorText: string) => {
    cy.get("[role=dialog] input[type=radio]+label")
      .contains(selectorText)
      .click();
  }
);

Then("I see {string} modal", (modalHeading: string) => {
  cy.get("[role=dialog] h1 span").contains(modalHeading);
});

Then("I see a modal with text {string}", (text: string) => {
  cy.get("[role=dialog] div.pf-v5-c-modal-box__body").contains(text);
});

// Fields
When(
  "I type in the field {string} text {string}",
  (fieldName: string, content: string) => {
    cy.get("[role=dialog] label")
      .contains(fieldName)
      .parent()
      .then(($label) => {
        cy.get("[name=modal-form-" + $label.attr("for") + "]").type(content);
      });
  }
);

// Data tables
When("I select entry {string} in the data table", (name: string) => {
  cy.get("tr[id=" + name + "] input[type=checkbox]").check();
});

When("I click on {string} entry in the data table", (name: string) => {
  cy.get("tr[id=" + name + "] a")
    .contains(name)
    .click();
});

Then("I should see {string} entry in the data table", (name: string) => {
  cy.get("tr[id=" + name + "]").should("be.visible");
});

Then("I should not see {string} entry in the data table", (name: string) => {
  cy.get("tr[id=" + name + "]").should("not.exist");
});
Then(
  "entry {string} should have attribute {string} set to {string}",
  function (name: string, column: string, value: string) {
    cy.get("tr[id=" + name + "] td[data-label=" + column + "]").contains(value);
  }
);

// Notifications
Then(
  "I should see {string} alert with text {string}",
  (type: string, content: string) => {
    cy.get("div.pf-v5-c-alert.pf-m-" + type).contains(content);
  }
);

// Kebab
When("I click on kebab menu and select {string}", (buttonName: string) => {
  cy.get("#main-dropdown-kebab").click();
  cy.get("button.pf-v5-c-dropdown__menu-item").contains(buttonName).click();
});
