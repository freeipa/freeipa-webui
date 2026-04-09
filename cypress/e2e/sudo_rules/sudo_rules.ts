import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import { isElementDisabled, selectEntry } from "../common/data_tables";
import { navigateTo } from "../common/navigation";

const SUDO_RULE_STATUS_LABEL = "Status";

const isDisabled = (name: string) => {
  isElementDisabled(name, SUDO_RULE_STATUS_LABEL);
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
