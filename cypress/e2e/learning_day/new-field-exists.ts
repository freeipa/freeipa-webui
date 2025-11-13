import { Then } from "@badeball/cypress-cucumber-preprocessor";

// Step: Verify that a textbox with a specific data-cy attribute exists
Then("I should see a textbox with data-cy {string}", (dataCy: string) => {
  cy.dataCy(dataCy).should("exist");
  // Scroll element into view before checking visibility
  cy.dataCy(dataCy).then(($el) => {
    const element = ($el as unknown as HTMLElement[])[0];
    if (element) {
      element.scrollIntoView({ block: "center" });
    }
  });
  cy.dataCy(dataCy).should("be.visible");
});
