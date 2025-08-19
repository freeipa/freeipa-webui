import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import { navigateTo } from "../common/navigation";
import { isOptionSelected, selectOption } from "../common/ui/select";

Given("subid for owner {string} exists", (owner: string) => {
  loginAsAdmin();
  navigateTo("subordinate-ids");

  cy.dataCy("subids-button-add").click();
  cy.dataCy("add-subid-modal").should("exist");

  selectOption(owner, "modal-simple-owner-select");
  isOptionSelected(owner, "modal-simple-owner-select");

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-subid-modal").should("not.exist");
  cy.dataCy("add-subid-success").should("exist");

  cy.get("table[id='subordinate-ids-table'] tr a").should("exist");
  logout();
});

When("I click on the first subid", () => {
  cy.get("table[id='subordinate-ids-table'] tr a").first().click();
});

Then("I should be on the subid settings page", () => {
  const re =
    /subordinate-ids\/[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$/;
  cy.url().should("match", re);
});
