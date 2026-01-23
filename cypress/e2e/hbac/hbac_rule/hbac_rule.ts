import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { HbacRuleUserType } from "./parameter_types";

const HBAC_RULE_USER_OPTIONS_MAP: Readonly<Record<HbacRuleUserType, string>> = {
  user: "--users",
  group: "--groups",
};

Given(
  "I have element {HbacRuleUserType} named {string} in rule {string}",
  (elementType: HbacRuleUserType, element: string, ruleName: string) => {
    const option = HBAC_RULE_USER_OPTIONS_MAP[elementType];

    cy.ipa({
      command: "hbacrule-add-user",
      name: ruleName,
      specificOptions: `${option}=${element}`,
    });
  }
);

Given(
  "I have host {string} in rule {string}",
  (host: string, ruleName: string) => {
    const hostFqdn = `${host}.${Cypress.env("HOSTNAME")}`;

    cy.ipa({
      command: "hbacrule-add-host",
      name: ruleName,
      specificOptions: `--hosts=${hostFqdn}`,
    });
  }
);

Given(
  "I have hostgroup {string} in rule {string}",
  (hostgroup: string, ruleName: string) => {
    cy.ipa({
      command: "hbacrule-add-host",
      name: ruleName,
      specificOptions: `--hostgroups=${hostgroup}`,
    });
  }
);

Given(
  "I have service {string} in rule {string}",
  (service: string, ruleName: string) => {
    cy.ipa({
      command: "hbacrule-add-service",
      name: ruleName,
      specificOptions: `--hbacsvcs=${service}`,
    });
  }
);

Given(
  "I have servicegroup {string} in rule {string}",
  (svcGroup: string, ruleName: string) => {
    cy.ipa({
      command: "hbacrule-add-service",
      name: ruleName,
      specificOptions: `--hbacsvcgroups=${svcGroup}`,
    });
  }
);
