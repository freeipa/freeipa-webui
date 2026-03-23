import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given(
  "id range {string} exists with base ID {string}, range size {string}, primary RID base {string}, and secondary RID base {string}",
  (
    idRange: string,
    baseID: string,
    rangeSize: string,
    primaryRIDBase: string,
    secondaryRIDBase: string
  ) => {
    cy.ipa({
      command: "idrange-add",
      name: idRange,
      specificOptions: `--base-id=${baseID} --range-size=${rangeSize} --rid-base=${primaryRIDBase} --secondary-rid-base=${secondaryRIDBase}`,
    });
  }
);

Given("I delete id range {string}", (idRange: string) => {
  cy.ipa({
    command: "idrange-del",
    name: idRange,
  });
});
