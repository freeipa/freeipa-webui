import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

const SSH_RSA_valid_1: string =
  "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDBVmLXpTDhrYkABOPlADFk" +
  "GV8/QfgQqUQ0xn29hk18t/NTEQOW/Daq4EF84e9aTiopRXIk7jahBLzwWTZI" +
  "WwuvegGYqs89bDhUHZEnS9TBfXkkYq9LamlEVooR5kxb/kPtCnmMMXhQUOzH" +
  "xqakuZiN4AduRCzaecu0mearVjZWAChM3fYp4sMXKoRzek2F/xOUh81GxrW0" +
  "kbhpbaeXd6oG8p6AC3QCrEspzX78WEOCPSTJlx/BAv77A27b5zO2cSeZNbZq" +
  "XFqaQQj8AX46qoATWLhOnokoE2xeJTKikG/4nmc3D2KO6SRh66dEQWtJuVVw" +
  "ZqgQRdaseDjjgR1FKbC1";

const SSH_RSA_valid_2: string =
  "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAgQDHQXMb5GTSEOOHezYfjydz" +
  "uZ7U9Zphmoyoo3h+83vRfxggovQmSrl611/SIL8Gja8Cdt/91SSC/QrDwuzf" +
  "PYsk2Q8GS4RSuLskqlEP69u5CaVPv8qlWZXJ9w0YhtKsbXXMqgHBBdP6ojdp" +
  "iyWU+hD/yzFL8wKzZ9WQjAqNF2ER0Q== noname";

// Functions specific to active_users_handling.feature
Given("sample testing user {string} exists", (username: string) => {
  cy.createTestUser(username);
});

Then("I am on {string} user settings page", (username: string) => {
  cy.url().then(($url) => {
    if ($url.includes("settings")) {
      cy.get(".pf-v5-c-breadcrumb__item")
        .contains(username)
        .should("be.visible");
      cy.get("h1>p").contains(username).should("be.visible");
    }
  });
});

When("I click in the field {string}", (fieldName: string) => {
  cy.get("#settings-page span").contains(fieldName).parent().click();
});

When("I type in the selected field text {string}", (inputText: string) => {
  cy.focused().type(inputText);
});

Then(
  "I should see value {string} in the field {string}",
  (value: string, fieldName: string) => {
    cy.get("#settings-page span")
      .contains(fieldName)
      .parent()
      .click()
      .focused()
      .invoke("val")
      .should("eq", value);
  }
);

Then("the active field should be read-only", () => {
  cy.focused().should("have.attr", "readonly");
});

Then("the active field should be empty", () => {
  cy.focused().should("have.value", "");
});

// SSH keys
When("I click on Add key in the SSH public keys section", () => {
  cy.get('button[name="add-ssh-public-key"').click();
});

When("I put SSH key named {string} into the text area", (keyID: string) => {
  let selectedKey = "";
  if (keyID == "valid sample 1") {
    selectedKey = SSH_RSA_valid_1;
  } else if (keyID == "valid sample 2") {
    selectedKey = SSH_RSA_valid_2;
  } else if (keyID == "invalid sample") {
    selectedKey = "invalid key";
  }
  cy.get('textarea[name="ipasshpubkey"').type(selectedKey, { delay: 0 });
});

Then(
  "I should see {int} SSH keys in the SSH public keys section",
  (count: number) => {
    cy.get('small:contains("Key (ssh-rsa)")').should("have.length", count);
  }
);

When("I click on Show key button for key number {int}", (order: number) => {
  cy.get('button[name="show-ssh-public-key-' + (order - 1) + '"]').click();
});

When("I click on Delete button for key number {int}", (order: number) => {
  cy.get('button[name="remove-ssh-public-key-' + (order - 1) + '"]').click();
});

Then("the SSH key should match {string}", (keyID: string) => {
  let selectedKey = "";
  if (keyID == "valid sample 1") {
    selectedKey = SSH_RSA_valid_1;
  } else if (keyID == "valid sample 2") {
    selectedKey = SSH_RSA_valid_2;
  }
  cy.get('textarea[name="ipasshpubkey"').should("have.text", selectedKey);
});
