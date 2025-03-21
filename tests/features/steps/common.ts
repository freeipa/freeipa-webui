/* eslint-disable @typescript-eslint/ban-ts-comment */
/// <reference types="cypress" />
import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

// navigation
Given("I am on {string} page", (handle: string) => {
  cy.url().then(($url) => {
    if (!$url.includes(handle)) {
      cy.visit(Cypress.env("base_url") + "/" + handle, { timeout: 9000 });
    }
  });
});

Given(
  "I navigate to {string} page using the breadcrumb link",
  (to_page: string) => {
    // I click on the breadcrump link {string}
    cy.get(".pf-v5-c-breadcrumb__item a").contains(to_page).click();
    // Check if the page is loaded
    cy.url().then(($url) => {
      if (!$url.includes(to_page)) {
        cy.visit(Cypress.env("base_url") + "/" + to_page);
      }
    });
  }
);

// - E.g. "I am on the 'sudo-rules' > 'sudorule-1' Settings page"
Given(
  "I am on the {string} > {string} Settings page",
  (toPage: string, entityName: string) => {
    cy.visit(Cypress.env("base_url") + "/" + toPage + "/" + entityName);
    cy.wait(1000);
  }
);

// login
Given("I am logged in as {string}", (username: string) => {
  cy.wait(1000);
  cy.url().then(($url) => {
    if ($url.includes("modern_ui/login")) {
      // @ts-ignore
      cy.loginAsAnUser(
        Cypress.env("admin_login"),
        Cypress.env("admin_password")
      );
    }
  });
  cy.get(
    "div.pf-v5-c-masthead__content button span.pf-v5-c-menu-toggle__text",
    { timeout: 9000 }
  ).then(($ele) => {
    if ($ele.text() !== username) {
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
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
  const regex = new RegExp("^" + tabText + "$", "i");
  cy.get("nav a").contains(regex).click();
});

When("I click on {string} page tab", (tabText: string) => {
  cy.get(".pf-v5-c-tabs__link").contains(tabText).click();
});

When("I click on {string} button", function (buttonText: string) {
  const regex = new RegExp("^" + buttonText + "$", "i");
  cy.get("button", { timeout: 9000 }).contains(regex).click();
});

When("I click on ID {string} button", function (id: string) {
  cy.get('button[id="' + id + '"').click();
});

Then("button {string} should be enabled", function (buttonText: string) {
  const regex = new RegExp("^" + buttonText + "$", "i");
  cy.get("button").contains(regex).should("be.enabled");
});

Then("button {string} should be disabled", function (buttonText: string) {
  const regex = new RegExp("^" + buttonText + "$", "i");
  cy.get("button").contains(regex).should("be.disabled");
});

// Modals
When(
  "in the modal dialog I click on {string} button",
  function (buttonText: string) {
    cy.get("[role=dialog] footer button").contains(buttonText).click();
    cy.wait(1000);
  }
);

// This takes only the buttons found in the footer of the modal (e.g. "Cancel", "Save", "Add")
Then(
  "I click on the {string} button located in the footer modal dialog",
  (buttonName: string) => {
    cy.get("[role=dialog] footer").find("button").contains(buttonName).click();
    cy.wait(0);
    /**
     * Sometimes hooks do not complete their event handlers because the
     * Cypress test hogs the Javascript thread, and cy.wait(0) releases the
     * thread so that React hooks can complete the click() action.
     */
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

Then("I see a modal with title text {string}", (titleText: string) => {
  cy.get("[role=dialog] h1.pf-v5-c-modal-box__title")
    .find("span")
    .contains(titleText);
});

// - Delete
// -- Elements to delete on tables
Then(
  "the {string} element should be in the dialog table with id {string}",
  (groupName: string, tableId: string) => {
    cy.get("div[role='dialog'")
      .find("table#" + tableId)
      .find("td.pf-v5-c-table__td")
      .contains(groupName)
      .should("be.visible");
  }
);

// -- Element to delete on cards
Then(
  "the {string} element should be in the dialog card with id {string}",
  () => {
    cy.get("div[role='dialog'");
  }
);

// Fields
When(
  "I type in the field {string} text {string}",
  (fieldName: string, content: string) => {
    const regex = new RegExp("^" + fieldName + "$", "i");
    cy.get("[role=dialog] label")
      .contains(regex)
      .parent()
      .then(($label) => {
        cy.get("#modal-form-" + $label.attr("for")).type(content);
      });
  }
);

When(
  "I type in the flex field {string} text {string}",
  (fieldName: string, content: string) => {
    const regex = new RegExp("^" + fieldName + "$", "i");
    cy.get("[role=dialog] label")
      .contains(regex)
      .parent()
      .parent()
      .parent()
      .find("input")
      .type(content);
  }
);

When(
  "I type in the textarea {string} text {string}",
  (name: string, value: string) => {
    cy.get('textarea[name="' + name.toLowerCase() + '"').type(value, {
      delay: 0,
    });
  }
);

When(
  "Then I should see {string} in the textarea {string}",
  (value: string, name: string) => {
    cy.get('textarea[name="' + name.toLowerCase() + '"').contains(value);
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

When("I clear the textarea {string}", (id) => {
  cy.get("textarea[id='" + id + "']")
    .focus()
    .clear();
});

// Data tables
When("I select entry {string} in the data table", (name: string) => {
  cy.get("tr[id='" + name + "'] input[type=checkbox]").check();
});

When("I click on {string} entry in the data table", (name: string) => {
  cy.get("tr[id='" + name + "'] a", { timeout: 9000 })
    .contains(name)
    .click();
});

When(
  "I select {string} entry with no link in the data table",
  (name: string) => {
    cy.get("tr[id^='" + name + "'] label input").click();
  }
);

When(
  "I click on {string} entry in the data table with name id {string}",
  (entry: string, name: string) => {
    cy.find("table[name=" + name + "]")
      .get("tr[id='" + entry + "'] a")
      .contains(entry)
      .click();
  }
);

Then("I should see {string} entry in the data table", (name: string) => {
  cy.get("tr[id='" + name + "']", { timeout: 3000 }).should("be.visible");
});

Then(
  "I should see {string} entry in the data table with ID {string}",
  (name: string, tableId: string) => {
    cy.get("table#" + tableId + " tbody td a").contains(name);
  }
);

Then("I should not see {string} entry in the data table", (name: string) => {
  cy.get("tr[id='" + name + "']").should("not.exist");
});

Then(
  "I should not see {string} entry in the data table with ID {string}",
  (name: string, tableId: string) => {
    cy.get("table#" + tableId + "tbody tr[id='" + name + "']").should(
      "not.exist"
    );
  }
);

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

Then(
  "I should not see partial {string} entry in the data table",
  (name: string) => {
    cy.get("tr[id^='" + name + "']").should("not.exist");
  }
);

When("I select partial entry {string} in the data table", (name: string) => {
  cy.get("tr[id^='" + name + "'] input[type=checkbox]", {
    timeout: 9000,
  }).check();
});

// Notifications
Then(
  "I should see {string} alert with text {string}",
  (type: string, content: string) => {
    cy.get("div.pf-v5-c-alert.pf-m-" + type, {
      timeout: 10000,
    }).contains(content);
  }
);

Then("I close the alert", () => {
  cy.get(".pf-v5-c-alert button").click().wait(200);
});

// Kebab
When("I click on kebab menu and select {string}", (buttonName: string) => {
  cy.get("body").then(($body) => {
    if ($body.find("#main-dropdown-kebab").length) {
      cy.get("#main-dropdown-kebab").click();
    } else if ($body.find("#toggle-action-buttons").length) {
      cy.get("#toggle-action-buttons").click();
    }
  });
  const regex = new RegExp("^" + buttonName + "$", "i");
  cy.get("button.pf-v5-c-menu__item").contains(regex).click();
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
  // Intentionally not using regex matching as these elements often contain parentheses
  cy.get("div.pf-v5-c-check")
    .find("label")
    .contains(checkboxName)
    .prev()
    .should("be.checked");
});

Then("I should see the {string} checkbox unchecked", (checkboxName: string) => {
  // Intentionally not using regex matching as these elements often contain parentheses
  cy.get("div.pf-v5-c-check")
    .find("label")
    .contains(checkboxName)
    .prev()
    .should("not.be.checked");
});

When(
  "I click on {string} checkbox in {string} section",
  (checkboxName: string, section: string) => {
    const sectionRegex = new RegExp("^" + section + "$", "i");
    // Intentionally not using regex matching for the checkbox name as these elements often contain parentheses
    cy.get("div.pf-v5-c-form__group-label")
      .contains(sectionRegex)
      .next()
      .get("div.pf-v5-c-check")
      .find("label")
      .contains(checkboxName)
      .prev()
      .click();
  }
);

When("I click on {string} checkbox in modal", (checkboxName: string) => {
  // Intentionally not using regex matching as these elements often contain parentheses
  cy.get("div.pf-v5-c-check")
    .find("label")
    .contains(checkboxName)
    .prev()
    .click();
});

When("I click on {string} checkbox", (checkboxName: string) => {
  cy.get("div.pf-v5-c-check")
    .find("label")
    .contains(checkboxName)
    .prev()
    .click();
});

When("I click on {string} inline checkbox", (checkboxName: string) => {
  cy.get("div.pf-v5-c-check").find("label").contains(checkboxName).click();
});

When("I click on ID {string} checkbox", (checkboxName: string) => {
  cy.get("div.pf-v5-c-check")
    .find('input[id="' + checkboxName + '"]')
    .click();
});

// Selectors
// This function below works with dropdown menus
When("I click in the {string} selector field", (selectorName: string) => {
  cy.get("div.pf-v5-c-form__group-label")
    .contains(selectorName)
    .parent()
    .next()
    .find("button.pf-v5-c-menu-toggle")
    .click();
});

When("I click in the selector field with ID {string}", (id: string) => {
  cy.get("div.pf-v5-c-menu-toggle")
    .find("div[id=" + id + "]")
    .click();
});

When(
  "I click in the typeahead selector field with ID {string}",
  (id: string) => {
    cy.get("div.pf-m-typeahead")
      .find("div[id=" + id + "]")
      .click();
  }
);

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

Then(
  "in the selector with ID {string} I should see option {string} selected",
  (id: string, option: string) => {
    cy.get("div.pf-v5-c-menu-toggle")
      .find("div[id=" + id + "]")
      .find("input[value='" + option + "']");
  }
);

// Also works for dropdown menus
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

When("I click toolbar dropdown {string}", (name: string) => {
  cy.get("div.pf-v5-c-toolbar__item")
    .find("button.pf-v5-c-menu-toggle")
    .contains(name)
    .click();
});

When("I click toolbar dropdown item {string}", (name: string) => {
  cy.get("li.pf-v5-c-menu__list-item")
    .find("button.pf-v5-c-menu__item")
    .contains(name)
    .click();
});

Then(
  "I should see the option {string} selected in the {string} selector",
  (option: string, selectorName: string) => {
    const optionRegex = new RegExp("^" + option + "$", "i");
    const selectorRegex = new RegExp("^" + selectorName + "$", "i");
    cy.get("div.pf-v5-c-form__group-label")
      .contains(selectorRegex)
      .parent()
      .next()
      .find("span.pf-v5-c-menu-toggle__text")
      .contains(optionRegex);
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

Then(
  "I should see an empty readonly text input field with ID {string}",
  (id: string) => {
    cy.get("input[id=" + id + "]")
      .invoke("prop", "value")
      .should("be.empty");
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
    const sectionRegex = new RegExp("^" + section + "$", "i");
    const buttonRegex = new RegExp("^" + buttonName + "$", "i");
    cy.get("div.pf-v5-c-form__group-label")
      .contains(sectionRegex)
      .parent()
      .next()
      .find("button")
      .contains(buttonRegex)
      .click();
  }
);

When(
  "in the {string} section I click the {string} button of the text input field with text {string}",
  (section: string, button: string, text: string) => {
    const sectionRegex = new RegExp("^" + section + "$", "i");
    const buttonRegex = new RegExp("^" + button + "$", "i");
    cy.get("div.pf-v5-c-form__group-label")
      .contains(sectionRegex)
      .parent()
      .next()
      .find("input[value='" + text + "']")
      .parent()
      .parent()
      .next()
      .find("button")
      .contains(buttonRegex)
      .click();
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
  "I should not see the text input field with text {string} under the field {string}",
  (text: string, fieldName: string) => {
    const regex = new RegExp("^" + fieldName + "$", "i");
    cy.get("div.pf-v5-c-form__group-label")
      .contains(regex)
      .parent()
      .next()
      .find("input[value='" + text + "']")
      .should("not.exist");
  }
);

Then(
  "I should see value {string} in any of the textboxes that belong to the field {string}",
  (value: string, fieldName: string) => {
    const regex = new RegExp("^" + fieldName + "$", "i");
    cy.get("div.pf-v5-c-form__group-label")
      .contains(regex)
      .parent()
      .next()
      .find("input[value='" + value + "']");
  }
);

Then(
  "I should see no textboxes under the field {string}",
  (fieldName: string) => {
    const regex = new RegExp("^" + fieldName + "$", "i");
    cy.get("div.pf-v5-c-form__group-label")
      .contains(regex)
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
  cy.get("[role=dialog] button[aria-label=Search]", { timeout: 10000 })
    .eq(0)
    .click();
  /**
   * Sometimes hooks do not complete their event handlers because the
   * Cypress test hogs the Javascript thread, and cy.wait(0) releases the
   * thread so that React hooks can complete the click() action.
   */
  cy.wait(0);
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
  cy.get(".pf-v5-c-dual-list-selector__item-text", { timeout: 2000 })
    .contains(value)
    .click();
});

Then("I click on the dual list add selected button", () => {
  cy.get('button[aria-label="Add selected"]').click();
});

Then("I click on the first dual list item", () => {
  cy.get("li[id=basicSelectorWithSearch-available-pane-list-option-0]")
    .eq(0)
    .click()
    .wait(1000);
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

// Get tab badge count. This expects the tab has an id that ends with "_count"
Then(
  "I should see the {string} tab count is {string}",
  (count_id: string, value: string) => {
    cy.get("span.pf-v5-c-badge[id=" + count_id + "_count]").contains(value);
  }
);

// NumberInput
When("I click on the {string} number plus button", (id: string) => {
  cy.get("div[name=" + id + "]")
    .find('button[aria-label="plus"]')
    .click();
});

When("I click on the {string} number minus button", (id: string) => {
  cy.get("div[name=" + id + "]")
    .find('button[aria-label="minus"]')
    .click();
});

Then(
  "I should see the {string} number input value is {string}",
  (id: string, value: string) => {
    cy.get("div[name=" + id + "]").find("input[value='" + value + "']");
  }
);

// Toggle group
When(
  "I click on the {string} option under ID {string} toggle group",
  (option: string, toggleId: string) => {
    cy.get("div[name=" + toggleId)
      .find("button")
      .contains(option)
      .click();
  }
);

Then(
  "I should see {string} selected in the ID {string} toggle group",
  (optionSelected: string, toggleId: string) => {
    cy.get("div[name=" + toggleId)
      .find("button")
      .contains(optionSelected)
      .get("button[aria-pressed=true]");
  }
);
