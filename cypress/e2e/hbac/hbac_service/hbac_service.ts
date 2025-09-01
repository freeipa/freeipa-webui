import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../../common/authentication";
import { navigateTo } from "../../common/navigation";
import {
  entryExists,
  entryDoesNotExist,
  searchForEntry,
  selectEntry,
} from "../../common/data_tables";
import { typeInTextbox } from "cypress/e2e/common/ui/textbox";

Given("HBAC service {string} exists", (serviceName: string) => {
  loginAsAdmin();
  navigateTo("hbac-services");

  searchForEntry(serviceName);
  cy.dataCy("hbac-services-button-add").click();
  cy.dataCy("add-hbac-service-modal").should("exist");

  typeInTextbox("modal-textbox-service-name", serviceName);
  cy.dataCy("modal-textbox-service-name").should("have.value", serviceName);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-hbac-service-modal").should("not.exist");
  cy.dataCy("add-hbacservice-success").should("exist");

  searchForEntry(serviceName);
  entryExists(serviceName);

  logout();
});

Given("I delete service {string}", (serviceName: string) => {
  loginAsAdmin();
  navigateTo("hbac-services");

  searchForEntry(serviceName);
  selectEntry(serviceName);

  cy.dataCy("hbac-services-button-delete").click();
  cy.dataCy("delete-hbac-services-modal").should("exist");
  entryExists(serviceName);

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("remove-hbacservices-success").should("exist");
  entryDoesNotExist(serviceName);

  logout();
});
