import {
  defineParameterType,
  Given,
} from "@badeball/cypress-cucumber-preprocessor";

/** Quoted feature value that may contain a comma-separated list (e.g. "cn,dn"). */
type CommaSeparatedString = string;

defineParameterType({
  name: "CommaSeparatedString",
  regexp: /"([^"]*)"/,
  transformer: (s: string): CommaSeparatedString => s,
});

Given("self-service permission {string} exists", (name: string) => {
  cy.ipa({
    command: "selfservice-add",
    name,
    specificOptions: "--attrs=cn",
  });
});

Given(
  "self-service permission {string} exists with permissions {CommaSeparatedString} and attribute(s) {CommaSeparatedString}",
  (
    name: string,
    permissions: CommaSeparatedString,
    attributes: CommaSeparatedString
  ) => {
    const permissionOptions = permissions
      .split(",")
      .map((permission) => `--permissions=${permission.trim()}`)
      .join(" ");
    const attributeOptions = attributes
      .split(",")
      .map((attribute) => `--attrs=${attribute.trim()}`)
      .join(" ");

    cy.ipa({
      command: "selfservice-add",
      name,
      specificOptions: `${permissionOptions} ${attributeOptions}`,
    });
  }
);

Given("I delete self-service permission {string}", (name: string) => {
  cy.ipa({
    command: "selfservice-del",
    name,
  });
});
