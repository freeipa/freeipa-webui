import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given(
  "override user {string} exists in view {string}",
  (username: string, viewName: string) => {
    cy.ipa({
      command: "idoverrideuser-add",
      name: viewName,
      specificOptions: username,
    });
  }
);

Given(
  "I delete override user {string} from view {string}",
  (username: string, viewName: string) => {
    cy.ipa({
      command: "idoverrideuser-del",
      name: viewName,
      specificOptions: username,
    });
  }
);
