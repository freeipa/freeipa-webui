import { Given } from "@badeball/cypress-cucumber-preprocessor";
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
  });
});

Given("I delete sudo rule {string}", (ruleName: string) => {
  cy.ipa({
    command: "sudorule-del",
    name: ruleName,
  });
});
