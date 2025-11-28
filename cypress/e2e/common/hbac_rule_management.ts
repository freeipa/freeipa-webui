import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  selectEntry,
  searchForEntry,
  entryDoesNotExist,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";

Given("hbac rule {string} exists", (ruleName: string) => {
  cy.ipa("hbacrule-show", ruleName, { failOnNonZeroExit: false }).then(
    (result) => {
      if (result.code !== 0) {
        cy.ipa("hbacrule-add", ruleName).then((addResult) => {
          if (addResult.code !== 0) {
            throw new Error(
              `Failed to add HBAC rule ${ruleName} ${addResult.stderr}`
            );
          }
        });
      }
    }
  );
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
