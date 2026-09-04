import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { MemberOfModal } from "./parameter_types";

Then("I should see {string} modal", (modalName: string) => {
  cy.dataCy(modalName).should("exist");
});

Then("I should not see {string} modal", (modalName: string) => {
  cy.get(`[data-cy='${modalName}']`, { timeout: 30000 }).should("not.exist");
});

const MODAL_TITLE_IDS = {
  "member-of-add-modal": "member-of-add-modal-title",
  "member-of-delete-modal": "member-of-delete-modal-title",
} as const;

Then(
  "I should see {MemberOfModal} modal with title {string}",
  (modalName: MemberOfModal, title: string) => {
    cy.get(`#${MODAL_TITLE_IDS[modalName]}`)
      .should("be.visible")
      .and("contain.text", title);
  }
);
