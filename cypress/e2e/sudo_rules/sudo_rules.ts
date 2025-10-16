import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import { selectEntry } from "../common/data_tables";
import { navigateTo } from "../common/navigation";

const isDisabled = (name: string) => {
  cy.get("tr[id='" + name + "'] td[data-label=Status]").contains("Disabled");
};

Given("I disable sudo rule {string}", (ruleName: string) => {
  loginAsAdmin();
  navigateTo("sudo-rules");
  selectEntry(ruleName);
  cy.dataCy("sudo-rules-button-disable").click();
  cy.dataCy("disable-enable-sudo-rules-modal").should("be.visible");
  cy.dataCy("modal-button-disable").click();
  cy.dataCy("disable-enable-sudo-rules-modal").should("not.exist");
  isDisabled(ruleName);
  logout();
});
