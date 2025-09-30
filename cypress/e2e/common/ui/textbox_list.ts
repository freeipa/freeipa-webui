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
    .children()
    .find(`div[name="value"]:has(input[value="${elementToRemove}"])`)
    .find('button:contains("Delete")')
    .click();
  cy.dataCy(dataCy)
    .children()
    .find(`input[value="${elementToRemove}"]`)
    .should("not.exist");
};

export const removeAllElementsFromTextboxList = (dataCy: string) => {
  const deleteButtonSelector = `[data-cy^="${dataCy}-button-delete-"]`;

  cy.get("body").then(($body) => {
    if ($body.find(deleteButtonSelector).length > 0) {
      cy.get(deleteButtonSelector).first().click();

      removeAllElementsFromTextboxList(dataCy);
    }
  });
};

When(
  "I add {string} to {string} textbox list",
  (elementToAdd: string, dataCyList: string) => {
    const addButtonSelector = `${dataCyList}-button-add`;
    addElementToTextboxList(addButtonSelector, dataCyList, elementToAdd);
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

When(
  "I remove all elements from the {string} textbox list",
  (dataCyList: string) => {
    removeAllElementsFromTextboxList(dataCyList);
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
