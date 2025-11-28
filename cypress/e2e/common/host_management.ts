import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "./authentication";
import { selectEntry, searchForEntry, entryDoesNotExist } from "./data_tables";
import { navigateTo } from "./navigation";

Given("I delete host {string}", (hostName: string) => {
  loginAsAdmin();
  navigateTo("hosts");
  selectEntry(hostName);

  cy.dataCy("hosts-button-delete").click();
  cy.dataCy("delete-hosts-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-hosts-modal").should("not.exist");

  searchForEntry(hostName);
  entryDoesNotExist(hostName);
  logout();
});

Given("host {string} exists", (hostName: string) => {
  cy.ipa("host-show", hostName, { failOnNonZeroExit: false }).then((result) => {
    if (result.code !== 0) {
      cy.ipa("host-add --force", hostName).then((addResult) => {
        if (addResult.code !== 0) {
          throw new Error(`Failed to add host ${hostName} ${addResult.stderr}`);
        }
      });
    }
  });
});
