import { When } from "@badeball/cypress-cucumber-preprocessor";
import { checkEntry } from "./data_tables";

When(
  "I select entry {string} in the settings data table {string}",
  (name: string, table: string) => {
    findEntryInTable(name, table);
    checkEntry(name);
  }
);

export const findEntryInTable = (name: string, table: string) => {
  cy.dataCy("search-" + table)
    .find("input")
    .clear();
  cy.dataCy("search-" + table)
    .find("input")
    .should("have.value", "");
  cy.dataCy("search-" + table)
    .find("input")
    .type(name);
  cy.dataCy("search-" + table)
    .find("input")
    .should("have.value", name);
};
