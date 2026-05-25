import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given(
  "override group {string} exists in view {string}",
  (groupName: string, viewName: string) => {
    cy.ipa({
      command: "idoverridegroup-add",
      name: viewName,
      specificOptions: `${groupName} --group-name=${groupName}`,
    });
  }
);

Given(
  "I delete override group {string} from view {string}",
  (groupName: string, viewName: string) => {
    cy.ipa({
      command: "idoverridegroup-del",
      name: viewName,
      specificOptions: groupName,
    });
  }
);
