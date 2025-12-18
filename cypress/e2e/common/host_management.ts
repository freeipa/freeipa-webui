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
  cy.ipa({
    command: "host-add --force",
    name: hostName,
  }).then((result) => {
    cy.log(result.stderr);
    cy.log(result.stdout);
  });
});
