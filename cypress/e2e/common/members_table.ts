import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { checkEntry } from "./data_tables";

export const typeInMembersTableSearch = (name: string) => {
  cy.dataCy("search").find("input").clear();
  cy.dataCy("search").find("input").should("have.value", "");
  cy.dataCy("search").find("input").type(name);
  cy.dataCy("search").find("input").should("have.value", name);
};

export const submitMembersTableSearch = () => {
  cy.dataCy("search").find("button[type='submit']").click();
};

export const clearMembersTableSearch = () => {
  cy.dataCy("search").find("input").clear();
  cy.dataCy("search").find("input").should("have.value", "");
  submitMembersTableSearch();
};

export const searchForMembersEntry = (name: string) => {
  typeInMembersTableSearch(name);
  submitMembersTableSearch();
};

export const selectMembersEntry = (name: string) => {
  searchForMembersEntry(name);
  checkEntry(name);
};

When("I search for {string} in the members table", (name: string) => {
  searchForMembersEntry(name);
});

When("I type {string} in the members table search field", (name: string) => {
  typeInMembersTableSearch(name);
});

Then(
  "I should see {string} in the members table search field",
  (name: string) => {
    cy.dataCy("search").find("input").should("have.value", name);
  }
);

When("I submit the members table search", () => {
  submitMembersTableSearch();
});

When("I clear the members table search field", () => {
  clearMembersTableSearch();
});

When("I select entry {string} in the members table", (name: string) => {
  selectMembersEntry(name);
});
