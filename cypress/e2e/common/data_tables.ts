import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

export const entryExists = (name: string) => {
  cy.get("tr[id='" + name + "']").should("exist");
};

export const entryDoesNotExist = (name: string) => {
  cy.get("tr[id='" + name + "']").should("not.exist");
};

export const searchForEntry = (name: string) => {
  cy.dataCy("search").find("input").clear();
  cy.dataCy("search").find("input").should("have.value", "");
  cy.dataCy("search").find("input").type(name);
  cy.dataCy("search").find("input").should("have.value", name);

  cy.dataCy("search").find("button[type='submit']").click();
};

export const checkEntry = (name: string) => {
  cy.get("tr[id='" + name + "'] input[type=checkbox]").check();
  cy.get("tr[id='" + name + "'] input[type=checkbox]").should("be.checked");
};

export const selectEntry = (name: string) => {
  searchForEntry(name);
  checkEntry(name);
};

export const isSelected = (name: string) => {
  cy.get("tr[id='" + name + "'] input[type=checkbox]").should("be.checked");
};

export const isNotSelected = (name: string) => {
  cy.get("tr[id='" + name + "'] input[type=checkbox]").should("not.be.checked");
};

When("I search for {string} in the data table", (name: string) => {
  searchForEntry(name);
});

Then("I should see {string} entry in the data table", (name: string) => {
  entryExists(name);
});

Then("I should not see {string} entry in the data table", (name: string) => {
  entryDoesNotExist(name);
});

Then(
  "I should see {string} entry in the data table with attribute {string} set to {string}",
  (name: string, attribute: string, value: string) => {
    entryExists(name);
    cy.get("tr[id='" + name + "'] td[data-label='" + attribute + "']").should(
      "have.text",
      value
    );
  }
);

When("I select entry {string} in the data table", (name: string) => {
  selectEntry(name);
});

Then(
  "I should see {string} entry selected in the data table",
  (name: string) => {
    isSelected(name);
  }
);

Then(
  "I should see {string} entry not selected in the data table",
  (name: string) => {
    isNotSelected(name);
  }
);
