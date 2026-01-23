import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { NetgroupMemberType } from "./parameter_types";

const OPTIONS_MAP: Readonly<Record<NetgroupMemberType, string>> = {
  user: "--users",
  group: "--groups",
  host: "--hosts",
  hostgroup: "--hostgroups",
  netgroup: "--netgroups",
  externalhost: "--hosts",
};

Given("netgroup {string} exists", (groupName: string) => {
  cy.ipa({
    command: "netgroup-add",
    name: groupName,
  });
});

Given("I delete netgroup {string}", (groupName: string) => {
  cy.ipa({
    command: "netgroup-del",
    name: groupName,
  });
});

Given(
  "I have element {NetgroupMemberType} named {string} in netgroup {string}",
  (elementType: NetgroupMemberType, element: string, groupName: string) => {
    const option = OPTIONS_MAP[elementType];
    const value =
      elementType === "host"
        ? `${element}.${Cypress.env("HOSTNAME")}`
        : element;

    cy.ipa({
      command: "netgroup-add-member",
      name: groupName,
      specificOptions: `${option}=${value}`,
    });
  }
);

Given(
  "I delete element {NetgroupMemberType} named {string} from netgroup {string}",
  (elementType: NetgroupMemberType, element: string, groupName: string) => {
    const option = OPTIONS_MAP[elementType];
    const value =
      elementType === "host"
        ? `${element}.${Cypress.env("HOSTNAME")}`
        : element;

    cy.ipa({
      command: "netgroup-remove-member",
      name: groupName,
      specificOptions: `${option}=${value}`,
    });
  }
);
