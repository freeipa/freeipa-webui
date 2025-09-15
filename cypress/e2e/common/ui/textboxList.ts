import { When } from "@badeball/cypress-cucumber-preprocessor";

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
  cy.dataCy(dataCy).children().find('button:contains("Delete")').click();
};

When(
  "I add {string} to {string} textbox list ",
  (elementToAdd: string, dataCyList: string) => {
    addElementToTextboxList(elementToAdd, dataCyList, elementToAdd);
  }
);

When(
  "I remove {string} from textbox list with dataCy {string}",
  (elementToRemove: string, dataCy: string) => {
    removeElementFromTextboxList(elementToRemove, dataCy);
  }
);

When(
  "I remove all elements from textbox list with dataCy {string}",
  (dataCy: string) => {
    removeAllElementsFromTextboxList(dataCy);
  }
);
