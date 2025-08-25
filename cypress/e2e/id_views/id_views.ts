import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  selectEntry,
  searchForEntry,
  entryDoesNotExist,
  entryExists,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { typeInTextbox } from "../common/ui/textbox";

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
  loginAsAdmin();
  navigateTo("id-views");

  cy.dataCy("id-views-button-add").click();
  cy.dataCy("add-id-view-modal").should("exist");

  typeInTextbox("modal-textbox-id-view-name", viewName);
  cy.dataCy("modal-textbox-id-view-name").should("have.value", viewName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-id-view-modal").should("not.exist");

  searchForEntry(viewName);
  entryExists(viewName);
  logout();
});
