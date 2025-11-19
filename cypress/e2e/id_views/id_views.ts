import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  selectEntry,
  searchForEntry,
  entryDoesNotExist,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";

Given("I delete view {string}", (viewName: string) => {
  loginAsAdmin();
  navigateTo("id-views");
  selectEntry(viewName);

  cy.dataCy("id-views-button-delete").click();
  cy.dataCy("delete-id-views-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-id-views-modal").should("not.exist");

  searchForEntry(viewName);
  entryDoesNotExist(viewName);
  logout();
});

Given("view {string} exists", (viewName: string) => {
  cy.log(`Ensuring view ${viewName} exists`);
  cy.ipa({
    command: "idview-add",
    name: viewName,
  }).then((result) => {
    cy.log(result.stderr);
    cy.log(result.stdout);
  });
});
