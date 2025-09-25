import { When } from "@badeball/cypress-cucumber-preprocessor";
import { checkEntry } from "./data_tables";

export const searchForMembersEntry = (name: string) => {
  cy.dataCy("search").find("input").clear();
  cy.dataCy("search").find("input").should("have.value", "");
  cy.dataCy("search").find("input").type(name);
  cy.dataCy("search").find("input").should("have.value", name);

  cy.dataCy("search").find("button[type='submit']").click();
};

export const selectMembersEntry = (name: string) => {
  searchForMembersEntry(name);
  checkEntry(name);
};

When("I search for {string} in the members table", (name: string) => {
  searchForMembersEntry(name);
});

When("I select entry {string} in the members table", (name: string) => {
  selectMembersEntry(name);
});
