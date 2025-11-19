import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  entryDoesNotExist,
  searchForEntry,
  selectEntry,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { typeInTextbox } from "../common/ui/textbox";

export const addSudoRule = (ruleName: string) => {
  cy.dataCy("sudo-rules-button-add").click();
  cy.dataCy("add-sudo-rule-modal").should("be.visible");

  typeInTextbox("modal-textbox-rule-name", ruleName);
  cy.dataCy("modal-textbox-rule-name").should("have.value", ruleName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-sudo-rule-modal").should("not.exist");
};

Given("sudo rule {string} exists", (ruleName: string) => {
  cy.ipa({
    command: "sudorule-add",
    name: ruleName,
  }).then((result) => {
    cy.log(result.stderr);
    cy.log(result.stdout);
  });
});

Given("I delete sudo rule {string}", (ruleName: string) => {
  loginAsAdmin();
  navigateTo("sudo-rules");
  selectEntry(ruleName);

  cy.dataCy("sudo-rules-button-delete").click();
  cy.dataCy("delete-sudo-rules-modal").should("be.visible");
  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-sudo-rules-modal").should("not.exist");
  cy.dataCy("remove-sudorules-success").should("be.visible");

  searchForEntry(ruleName);
  entryDoesNotExist(ruleName);
  logout();
});
