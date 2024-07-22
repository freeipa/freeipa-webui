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
      // @ts-ignore
      cy.loginAsAnUser(
        Cypress.env("admin_login"),
        Cypress.env("admin_password")
      );
    }
  });
  cy.get(
    "div.pf-v5-c-masthead__content button span.pf-v5-c-menu-toggle__text"
  ).then(($ele) => {
    if ($ele.text() != username) {
      // @ts-ignore
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
    // @ts-ignore
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

When("I click on {string} page tab", (tabText: string) => {
  cy.get(".pf-v5-c-tabs__link").contains(tabText).click();
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
    cy.get("[role=dialog] footer button").contains(buttonText).click();
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

When(
  "I type in the textarea {string} text {string}",
  (name: string, value: string) => {
    cy.get('textarea[name="' + name + '"').type(value, { delay: 0 });
  }
);

When(
  "Then I should see {string} in the textarea {string}",
  (value: string, name: string) => {
    cy.get('textarea[name="' + name + '"').contains(value);
  }
);

When("I clear the selected field", () => {
  cy.focused().clear();
});

When("I clear the field {string}", (id) => {
  cy.get("input[id='" + id + "']")
    .focus()
    .clear();
});

// Data tables
When("I select entry {string} in the data table", (name: string) => {
  cy.get("tr[id='" + name + "'] input[type=checkbox]").check();
});

When("I click on {string} entry in the data table", (name: string) => {
  cy.get("tr[id='" + name + "'] a")
    .contains(name)
    .click();
});

Then("I should see {string} entry in the data table", (name: string) => {
  cy.get("tr[id='" + name + "']").should("be.visible");
});

Then("I should not see {string} entry in the data table", (name: string) => {
  cy.get("tr[id='" + name + "']").should("not.exist");
});

Then(
  "entry {string} should have attribute {string} set to {string}",
  function (name: string, column: string, value: string) {
    cy.get("tr[id^=" + name + "] td[data-label=" + column + "]").contains(
      value
    );
  }
);

// Data table - but we only know the starting value of the entry so we
// use "id^="
Then(
  "I should see partial {string} entry in the data table",
  (name: string) => {
    cy.get("tr[id^='" + name + "']").should("be.visible");
  }
);

When("I select partial entry {string} in the data table", (name: string) => {
  cy.get("tr[id^='" + name + "'] input[type=checkbox]").check();
});

// Notifications
Then(
  "I should see {string} alert with text {string}",
  (type: string, content: string) => {
    cy.get("div.pf-v5-c-alert.pf-m-" + type).contains(content);
  }
);

Then("I close the alert", () => {
  cy.get(".pf-v5-c-alert button").click().wait(200);
});

// Kebab
When("I click on kebab menu and select {string}", (buttonName: string) => {
  cy.get("#main-dropdown-kebab").click();
  cy.get("span.pf-v5-c-menu__item-text").contains(buttonName).click();
});

When(
  "I click on the settings kebab menu and select {string}",
  (buttonName: string) => {
    cy.get("button[id=toggle-action-buttons]").click();
    cy.get("span.pf-v5-c-menu__item-text").contains(buttonName).click();
  }
);

// Checkboxes
Then("I should see the {string} checkbox checked", (checkboxName: string) => {
  cy.get("div.pf-v5-c-check")
    .find("label")
    .contains(checkboxName)
    .prev()
    .should("be.checked");
});

Then("I should see the {string} checkbox unchecked", (checkboxName: string) => {
  cy.get("div.pf-v5-c-check")
    .find("label")
    .contains(checkboxName)
    .prev()
    .should("not.be.checked");
});

When(
  "I click on {string} checkbox in {string} section",
  (checkboxName: string, section: string) => {
    cy.get("div.pf-v5-c-form__group-label")
      .contains(section)
      .next()
      .get("div.pf-v5-c-check")
      .find("label")
      .contains(checkboxName)
      .prev()
      .click();
  }
);

When("I click on {string} checkbox in modal", (checkboxName: string) => {
  cy.get("div.pf-v5-c-check")
    .find("label")
    .contains(checkboxName)
    .prev()
    .click();
});

When(
  "I click on {string} checkbox",
  (checkboxName: string, section: string) => {
    cy.get("div.pf-v5-c-check")
      .find("label")
      .contains(checkboxName)
      .prev()
      .click();
  }
);

// Selectors
When("I click in the {string} selector field", (selectorName: string) => {
  cy.get("div.pf-v5-c-form__group-label")
    .contains(selectorName)
    .parent()
    .next()
    .find("button.pf-v5-c-menu-toggle")
    .click();
});

When(
  "I select {string} in the {string} form selector field",
  (selection: string, selectorName: string) => {
    cy.get("div.pf-v5-c-form__group-label")
      .contains(selectorName)
      .parent()
      .next()
      .find("select")
      .select(selection);
  }
);

Then(
  "in the {string} selector I should see the {string} option available to be checked",
  (selectorName: string, option: string) => {
    const options = cy
      .get("div.pf-v5-c-form__group-label")
      .contains(selectorName)
      .parent()
      .next()
      .find("div.pf-v5-c-menu__content");
    options.should("contain", option);
  }
);

When(
  "I select {string} option in the {string} selector",
  (option: string, selectorName: string) => {
    const selectorNameFound = cy
      .get("div.pf-v5-c-form__group-label")
      .contains(selectorName);
    if (selectorNameFound) {
      const itemsOptionsList = selectorNameFound
        .parent()
        .next()
        .get("div.pf-v5-c-menu");
      const itemOptionSelected = itemsOptionsList.contains(option);
      if (itemOptionSelected) {
        itemOptionSelected.click({ force: true });
      }
    }
  }
);

Then(
  "I should see the option {string} selected in the {string} selector",
  (option: string, selectorName: string) => {
    cy.get("div.pf-v5-c-form__group-label")
      .contains(selectorName)
      .parent()
      .next()
      .find("span.pf-v5-c-menu-toggle__text")
      .contains(option);
  }
);

Then(
  "I should see a new empty text input field with ID {string}",
  (id: string) => {
    cy.get("input#" + id).should("be.empty");
  }
);

Then(
  "I should see {string} in text input field with ID {string}",
  (value: string, id: string) => {
    cy.get("input[id='" + id + "']").contains(value);
  }
);

Then(
  "I should see {string} in readonly text input field with ID {string}",
  (value: string, id: string) => {
    cy.get("input[id='" + id + "']")
      .invoke("prop", "value")
      .should("equal", value);
  }
);

Then(
  "I should see a non-empty text input field with ID {string}",
  (id: string) => {
    cy.get("input#" + id).should("not.be.empty");
  }
);

Then(
  "I should see a non-empty readonly text input field with ID {string}",
  (id: string) => {
    cy.get("input[id=" + id + "]")
      .invoke("prop", "value")
      .should("not.be.empty");
  }
);

When(
  "I type in the field with ID {string} the text {string}",
  (id: string, content: string) => {
    cy.get("input#" + id).type(content);
  }
);

When(
  "I click on {string} button in the {string} section",
  (buttonName: string, section: string) => {
    cy.get("div.pf-v5-c-form__group-label")
      .contains(section)
      .parent()
      .next()
      .find("button")
      .contains(buttonName)
      .click();
  }
);

When(
  "in the {string} section I click the {string} button of the text input field with text {string}",
  (section: string, button: string, text: string) => {
    cy.get("div.pf-v5-c-form__group-label")
      .contains(section)
      .parent()
      .next()
      .find("input[value='" + text + "']")
      .parent()
      .parent()
      .next()
      .find("button")
      .contains(button)
      .click();
  }
);

Then(
  "I should not see the text input field with text {string} under the field {string}",
  (text: string, fieldName: string) => {
    cy.get("div.pf-v5-c-form__group-label")
      .contains(fieldName)
      .parent()
      .next()
      .find("input[value='" + text + "']")
      .should("not.exist");
  }
);

Then(
  "I should see value {string} in any of the textboxes that belong to the field {string}",
  (value: string, fieldName: string) => {
    cy.get("div.pf-v5-c-form__group-label")
      .contains(fieldName)
      .parent()
      .next()
      .find("input[value='" + value + "']");
  }
);

Then(
  "I should not see value {string} in any of the textboxes that belong to the field {string}",
  (value: string, fieldName: string) => {
    cy
      .get("div.pf-v5-c-form__group-label")
      .contains(fieldName)
      .parent()
      .next()
      .find("input[value='" + value + "']").not;
  }
);

Then(
  "I should see no textboxes under the field {string}",
  (fieldName: string) => {
    cy.get("div.pf-v5-c-form__group-label")
      .contains(fieldName)
      .parent()
      .next()
      .find("input")
      .should("not.exist");
  }
);

Then("TextInput {string} should be enabled", function (id: string) {
  cy.get("input#" + id).should("be.enabled");
});

Then("TextInput {string} should be disabled", function (id: string) {
  cy.get("input#" + id).should("be.disabled");
});

// Search
When("I type {string} in the search field", (searchText: string) => {
  cy.get("div.pf-v5-c-toolbar input[name=search]")
    .eq(0)
    .type(searchText, { force: true });
});

Then(
  "I should see the {string} text in the search input field",
  (searchText: string) => {
    cy.get("input[name=search]").should("have.value", searchText);
  }
);

When("I click on the arrow icon to perform search", () => {
  cy.get("button[aria-label=Search]").eq(0).click().wait(1000);
});

Then("I click on the X icon to clear the search field", () => {
  cy.get("button[aria-label=Reset]").eq(0).click();
});

// Search Modal/Dual List
When("I type {string} in the modal search field", (searchText: string) => {
  cy.get("[role=dialog] input[name=search]")
    .eq(0)
    .type(searchText, { force: true });
});

Then(
  "I should see the {string} text in the modal search input field",
  (searchText: string) => {
    cy.get("[role=dialog] input[name=search]").should("have.value", searchText);
  }
);

When("I click on the arrow icon to perform search in modal", () => {
  cy.get("[role=dialog] button[aria-label=Search]").eq(0).click().wait(1000);
});

Then("I click on the X icon to clear the modal search field", () => {
  cy.get("[role=dialog] button[aria-label=Reset]").eq(0).click();
});

// Breadcrumb
Then("I click on the breadcrump link {string}", (value: string) => {
  cy.get(".pf-v5-c-breadcrumb__link").eq(0).contains(value).click();
});

// Dual list
Then("I click on the dual list item {string}", (value: string) => {
  cy.get(".pf-v5-c-dual-list-selector__item-text").contains(value).click();
});

Then("I click on the dual list add selected button", () => {
  cy.get('button[aria-label="Add selected"]').click();
});

Then("I click on the first dual list item", () => {
  cy.get("li[id=basicSelectorWithSearch-available-pane-list-option-0]")
    .eq(0)
    .click();
});

// Misc
When("I scroll up", () => {
  cy.get("#settings-page").scrollTo("top", {
    ensureScrollable: false,
    duration: 500,
  });
});

When("I scroll down", () => {
  cy.get("#settings-page").scrollTo("bottom", {
    ensureScrollable: false,
    duration: 500,
  });
});
