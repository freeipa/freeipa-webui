import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

export const addElementToTextboxList = (
  dataCyAddButton: string,
  dataCyList: string,
  elementToAdd: string
) => {
  cy.dataCy(dataCyAddButton).click();

  cy.dataCy(dataCyList)
    .children()
    .find('[name="value"]')
    .last()
    .find("input")
    .type(elementToAdd);

  cy.dataCy(dataCyList)
    .children()
    .find('div[name="value"]')
    .last()
    .find("input")
    .should("have.value", elementToAdd);
};

export const removeElementFromTextboxList = (
  elementToRemove: string,
  dataCy: string
) => {
  cy.dataCy(dataCy)
    .find(`input[value="${elementToRemove}"]`)
    .closest('div[name="value"]')
    .find('button:contains("Delete")')
    .click();
  cy.dataCy(dataCy)
    .find(`input[value="${elementToRemove}"]`)
    .should("not.exist");
};

export const removeAllElementsFromTextboxList = (dataCy: string) => {
  cy.dataCy(dataCy)
    .find(`[data-cy^="${dataCy}-button-delete-"]`)
    .then(($buttons) => {
      if ($buttons.length > 0) {
        cy.wrap($buttons).each(($btn) => {
          cy.wrap($btn).click();
        });
      }
    });
};

When(
  "I add {string} to {string} textbox list ",
  (elementToAdd: string, dataCyList: string) => {
    addElementToTextboxList(elementToAdd, dataCyList, elementToAdd);
  }
);

Then(
  "I should see {string} in the {string} textbox list",
  (element: string, dataCyList: string) => {
    cy.get(`[data-cy^='${dataCyList}']`)
      .filter(`[value="${element}"]`)
      .should("exist");
  }
);

Then(
  "I should not see {string} in the {string} textbox list",
  (element: string, dataCyList: string) => {
    cy.dataCy(dataCyList)
      .find('[data-cy^="' + dataCyList + '-textbox-"]')
      .each(($el) => {
        expect($el).not.to.have.value(element);
      });
  }
);

Then(
  "I should see the {string} textbox list is empty",
  (dataCyList: string) => {
    cy.dataCy(dataCyList).children().first().should("be.empty");
  }
);
