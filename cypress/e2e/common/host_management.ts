import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "./authentication";
import {
  selectEntry,
  searchForEntry,
  entryDoesNotExist,
  entryExists,
} from "./data_tables";
import { navigateTo } from "./navigation";
import { typeInTextbox } from "./ui/textbox";

Given("I delete host {string}", (hostName: string) => {
  loginAsAdmin();
  navigateTo("hosts");
  selectEntry(hostName + "." + Cypress.env("HOSTNAME"));

  cy.dataCy("hosts-button-delete").click();
  cy.dataCy("delete-hosts-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-hosts-modal").should("not.exist");

  searchForEntry(hostName + "." + Cypress.env("HOSTNAME"));
  entryDoesNotExist(hostName + "." + Cypress.env("HOSTNAME"));
  logout();
});

Given("host {string} exists", (hostName: string) => {
  loginAsAdmin();
  navigateTo("hosts");

  cy.dataCy("hosts-button-add").click();
  cy.dataCy("add-host-modal").should("exist");

  typeInTextbox("modal-textbox-host-name", hostName);
  cy.dataCy("modal-textbox-host-name").should("have.value", hostName);

  cy.dataCy("modal-checkbox-force-host").check();
  cy.dataCy("modal-checkbox-force-host").should("be.checked");

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-host-modal").should("not.exist");

  searchForEntry(hostName + "." + Cypress.env("HOSTNAME"));
  entryExists(hostName + "." + Cypress.env("HOSTNAME"));
  logout();
});
