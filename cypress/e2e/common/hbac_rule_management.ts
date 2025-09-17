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

Given("hbac rule {string} exists", (ruleName: string) => {
  loginAsAdmin();
  navigateTo("hbac-rules");

  cy.dataCy("hbac-rules-button-add").click();
  cy.dataCy("add-hbac-rule-modal").should("exist");

  typeInTextbox("modal-textbox-rule-name", ruleName);
  cy.dataCy("modal-textbox-rule-name").should("have.value", ruleName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-hbac-rule-modal").should("not.exist");

  searchForEntry(ruleName);
  entryExists(ruleName);
  logout();
});

Given("I delete hbac rule {string}", (ruleName: string) => {
  loginAsAdmin();
  navigateTo("hbac-rules");
  selectEntry(ruleName);

  cy.dataCy("hbac-rules-button-delete").click();
  cy.dataCy("delete-hbac-rules-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-hbac-rules-modal").should("not.exist");

  searchForEntry(ruleName);
  entryDoesNotExist(ruleName);
  logout();
});
