import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { typeInTextbox } from "../common/ui/textbox";

// Step: Modify a field to enable the Save button
When(
  "I modify the {string} {string} field to enable the Save button",
  (fieldDataCy: string, fieldType: string) => {
    if (fieldType === "textbox") {
      // Type in a textbox to modify the form
      typeInTextbox(fieldDataCy, "test");
    } else if (fieldType === "checkbox") {
      // Toggle a checkbox to modify the form
      // Always toggle (uncheck then check) to ensure modification is detected
      cy.dataCy(fieldDataCy).uncheck({ force: true });
      cy.dataCy(fieldDataCy).should("not.be.checked");
      cy.dataCy(fieldDataCy).check();
      cy.dataCy(fieldDataCy).should("be.checked");
    } else {
      throw new Error(`Unknown field type: ${fieldType}`);
    }
  }
);

// Step: Check if a button has a specific CSS class
Then(
  "the {string} button should have the {string} class",
  (buttonDataCy: string, className: string) => {
    cy.dataCy(buttonDataCy).should("have.class", className);
  }
);
