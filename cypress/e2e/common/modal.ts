import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I should see {string} modal", (modalName: string) => {
  cy.dataCy(modalName).should("exist");
});

Then("I should not see {string} modal", (modalName: string) => {
  cy.get(`[data-cy='${modalName}']`, { timeout: 30000 }).should("not.exist");
});

const MODAL_TITLE_IDS: Record<string, string> = {
  "member-of-add-modal": "member-of-add-modal-title",
  "member-of-delete-modal": "member-of-delete-modal-title",
};

Then(
  "I should see {string} modal with title {string}",
  (modalName: string, title: string) => {
    const titleId = MODAL_TITLE_IDS[modalName];
    if (!titleId) {
      throw new Error(`Unknown modal "${modalName}" for title assertion`);
    }
    cy.get(`#${titleId}`).should("be.visible").and("contain.text", title);
  }
);

Then(
  "I should see {string} entry in the {string} modal",
  (entry: string, modalName: string) => {
    cy.dataCy(modalName).contains("td", entry).should("exist");
  }
);
