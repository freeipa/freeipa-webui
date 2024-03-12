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

const userCert_valid_1: Record<string, string> = {
  body:
    "-----BEGIN CERTIFICATE-----" +
    "MIIHUzCCBTugAwIBAgIRAMbkmDZJZqhTAAAAAFZl8D0wDQYJKoZIhvcNAQELBQAw" +
    "RDELMAkGA1UEBhMCSFIxHTAbBgNVBAoTFEZpbmFuY2lqc2thIGFnZW5jaWphMRYw" +
    "FAYDVQQDEw1GaW5hIFJEQyAyMDE1MB4XDTE5MTAxNDEyMTMyMFoXDTIxMTAxNDEy" +
    "MTMyMFowgakxCzAJBgNVBAYTAkhSMRQwEgYDVQQKEwtIT1BTIEQuTy5PLjEWMBQG" +
    "A1UEYRMNSFIxMzE0ODgyMTYzMzEPMA0GA1UEBxMGWkFHUkVCMQ8wDQYDVQQEEwZI" +
    "Uk5KQUsxEjAQBgNVBCoTCUtSVU5PU0xBVjEZMBcGA1UEAxMQS1JVTk9TTEFWIEhS" +
    "TkpBSzEbMBkGA1UEBRMSSFI1NzI4OTI5NDg5NC4yLjIxMIIBIjANBgkqhkiG9w0B" +
    "AQEFAAOCAQ8AMIIBCgKCAQEAig6HRn4uUvbUgFltOqWWo5OLnoWyuc6pAtBdaj+U" +
    "z3TM06ZVJtpnEsPsYPZ3iRLSUWz4ymkc+uv9YeWSbpOo0ft6UQ4HYN155DchpSgX" +
    "ycwgiJXMCyic61RcX05xNXfdnm4gJOeh8E46P3IEb2wKEj5rYe5Uk/ZJ59cPNu1e" +
    "4rPKMTUH835awkyRCh1jWCXzWDowp8dl7kzroaotwRrJdxeL0taopyc9abUUm6kG" +
    "fTkdUbBw9uvFKq/uDJl+6IjmW2cMu8ZSPSctBDVEbySWk6yHW0ZXs+xvD+NYgBZT" +
    "8Mqzc8LFhHT3ERYjf2JfZuWwQ9ODAfQOZr5nS5Me3hGWRwIDAQABo4IC2DCCAtQw" +
    "DgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMEBggrBgEFBQcDAjCB" +
    "sAYDVR0gBIGoMIGlMIGYBgkrfIhQBQwMBAIwgYowQwYIKwYBBQUHAgEWN2h0dHA6" +
    "Ly9yZGMuZmluYS5oci9SREMyMDE1L0ZpbmFSREMyMDE1LUNQU05RQzEtMy1oci5w" +
    "ZGYwQwYIKwYBBQUHAgEWN2h0dHA6Ly9yZGMuZmluYS5oci9SREMyMDE1L0ZpbmFS" +
    "REMyMDE1LUNQU05RQzEtMy1lbi5wZGYwCAYGBACPegECMGkGCCsGAQUFBwEBBF0w" +
    "WzAfBggrBgEFBQcwAYYTaHR0cDovL29jc3AuZmluYS5ocjA4BggrBgEFBQcwAoYs" +
    "aHR0cDovL3JkYy5maW5hLmhyL1JEQzIwMTUvRmluYVJEQ0NBMjAxNS5jZXIwIwYD" +
    "VR0RBBwwGoEYa3J1bm9zbGF2Lmhybmpha0Bob3BzLmhyMIIBEwYDVR0fBIIBCjCC" +
    "AQYwgaSggaGggZ6GLGh0dHA6Ly9yZGMuZmluYS5oci9SREMyMDE1L0ZpbmFSREND" +
    "QTIwMTUuY3Jshm5sZGFwOi8vcmRjLWxkYXAyLmZpbmEuaHIvY249RmluYSUyMFJE" +
    "QyUyMDIwMTUsbz1GaW5hbmNpanNrYSUyMGFnZW5jaWphLGM9SFI/Y2VydGlmaWNh" +
    "dGVSZXZvY2F0aW9uTGlzdCUzQmJpbmFyeTBdoFugWaRXMFUxCzAJBgNVBAYTAkhS" +
    "MR0wGwYDVQQKExRGaW5hbmNpanNrYSBhZ2VuY2lqYTEWMBQGA1UEAxMNRmluYSBS" +
    "REMgMjAxNTEPMA0GA1UEAxMGQ1JMNzUxMB8GA1UdIwQYMBaAFBRjEbt7MwNodBwV" +
    "7eYswTxIG5ghMB0GA1UdDgQWBBTsd+TYygvZpCDO4kDpEnMKUkZOfTAJBgNVHRME" +
    "AjAAMA0GCSqGSIb3DQEBCwUAA4ICAQBIhFElngJOz+K+Q1FZLhEVLngMI92k858M" +
    "W6WHJ17SXhiR/m/ESOM5mVkOyiOQoM1po1I/jdUjE2mHHjiT12tJgkavkDxXz6aX" +
    "hKdj9VDVnzSp0wRvzIgQKWJF0JO82umt0I9x265cGXmRnRjxnDbEmgGKdFeSTbkp" +
    "gJfk73rdRbkIEI7FoOIzuaIRcHRIREkfUltu/1zD+bCMSY2pFA/0FQ15dFUDAeiD" +
    "6gqyjZgJJC5Rqd6SuMLfF4aAmz7FBgpk7iVm5jGRPltHCK3aH7OEczsDi1fYVtRA" +
    "PdRvKlzqbajv6Qj0YICMg3byh3ObN5xZp4qQmxGu9w7sJioMRP7DxxMuQKx4byV2" +
    "O0Jo7cdnc6BXfR+EipXz/phExWvRKwSOaelweOZUjz9sffpNYmvfuqmGhL5axNtj" +
    "XQmAJ1wOo8m7j4Czz7m7WFtxdiZ0SYGBxnr0xpCJrHgxLU640a/T/vDPh/SSai5S" +
    "E4unGGIf6vT0+5KY2gU6Jly7pqKpc44FHFrOdhWTEZzbmaiGL2QMh8VE2bAV9dNp" +
    "YT7djK+WY554vVLE3N7M21qiCNxD5awuIEkpZoF1d7A/wMgAe40ZMZ6UbYawzAPf" +
    "Tca3LXBLJOR4Ox2ZEbFt/JlIe7pZqR67s628axLaKCdQhOLP77KsNPMahzjQ7JmR" +
    "znZSOnBy/Q==" +
    "-----END CERTIFICATE-----",
  name: "krunoslav.hrnjak@hops.hr",
  serial: "264374074076456325397645183544606453821",
  issuer: "Fina RDC 2015",
  validFrom: "Mon Oct 14 12:13:20 2019 UTC",
  validTo: "Thu Oct 14 12:13:20 2021 UTC",
};

const userCert_valid_2: Record<string, string> = {
  body:
    "-----BEGIN CERTIFICATE-----" +
    "MIIDBzCCAe+gAwIBAgIUAgflIFYlpsbi0Q3xCZQxrVH+ROcwDQYJKoZIhvcNAQEL" +
    "BQAwEzERMA8GA1UEAwwIbXNoZWxsZXkwHhcNMjMwOTI3MDkxNzQ5WhcNMjQwOTI2" +
    "MDkxNzQ5WjATMREwDwYDVQQDDAhtc2hlbGxleTCCASIwDQYJKoZIhvcNAQEBBQAD" +
    "ggEPADCCAQoCggEBAKRn1wt+/xJMTfFsqW1fEKe/fmvhpNHTE763HOtR7euHQO1G" +
    "LfNEEtHSY6XCQYXjp/OmMQi3WXq7aKq3Vc0vsHqHYyzNEhrpRTUYrSRo5uj+ueF+" +
    "1CW3qR9+Ha9THJCXV7CKFyAjG7ir65JxJK6vMj7aVorK8ufbMLzu4wqs1xvVJ34b" +
    "c0eOiipm16Q+Vg47i+EZQHJ7oA9h9hV30rykafZ6F2v//v8hXrhWcEXrSJ6Ee5l4" +
    "FFBUg+6haJp5yXYQrfFUYdswsdPTb+EhPANUCLaTSzbS/5dUl8nAGnPqiM/QFDYO" +
    "JMMulnvcqzZ6quWZxbBGQSQEkAjeetHoVDvB4GECAwEAAaNTMFEwHQYDVR0OBBYE" +
    "FB24yJrnzai/SY6ltqfmepcdkm9pMB8GA1UdIwQYMBaAFB24yJrnzai/SY6ltqfm" +
    "epcdkm9pMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAJQHl/PY" +
    "BBVT1lEIAS0zP5TPjsLKP45LwmQrIwmX0biFoWlwVVevsCHy2ioC/vK+I2ZMAKd4" +
    "7GGJGT1P53j+lpzDCqKSXxCAr8CFIFekLekuaUI/kQHvsMiA0iesY9SmMnu/HQRW" +
    "7WXLeASqNwoIKf5M6bziyU5Yt1RLXL+7ZwWiKiKSm5oeoEmnLEy07zf/l77ZejbJ" +
    "EPhv84VJvPPpo143W5YoyZrWmQQLHhJc/iXdEcZDPvxNqJBujlxcKlL3oEuO2j04" +
    "A51I8+R1tTre6XzxLePrCSvBYDY4vaFxHm3DaE0dB3duhIpnP0BGztXJw1f+jkzu" +
    "znNXQyEYkmQUfi0=" +
    "-----END CERTIFICATE-----",
  name: "mshelley",
  serial: "11594046475060613235605226731133545093594498279",
  issuer: "mshelley",
  validFrom: "Wed Sep 27 09:17:49 2023 UTC",
  validTo: "Thu Sep 26 09:17:49 2024 UTC",
};
// Functions specific to active_users_handling.feature
Given("sample testing user {string} exists", (username: string) => {
  // @ts-ignore
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

// Certificates
When("I click on Add key in the Certificates section", () => {
  cy.get('button[name="add-certificate"]').click();
});

When("I put Certificate named {string} into the text area", (keyID: string) => {
  let selectedKey = "";
  if (keyID == "valid sample 1") {
    selectedKey = userCert_valid_1.body;
  } else if (keyID == "valid sample 2") {
    selectedKey = userCert_valid_2.body;
  } else if (keyID == "invalid sample - short") {
    selectedKey = "123=";
  } else if (keyID == "invalid sample - padding") {
    selectedKey = "123";
  }
  cy.get('textarea[name="usercertificate"').type(selectedKey, { delay: 0 });
});

Then(
  "I should see {int} certificates in the Certificates section",
  (count: number) => {
    cy.get("label[for='usercertificate']")
      .parent()
      .next()
      .get(".pf-v5-c-card__header")
      .should("have.length", count);
  }
);

When("I toggle the details for certificate number {int}", (order: number) => {
  cy.get("button[id=toggle-button-" + (order - 1) + "]").click();
});

Given(
  "certificate number {int} has name {string}",
  (order: number, name: string) => {
    cy.get("button[id=toggle-button-" + (order - 1) + "]")
      .parent()
      .parent()
      .should("contain", name);
  }
);

Then(
  "in the certificate details, I should see value {string} in the field {string}",
  (val: string, key: string) => {
    cy.get("div.pf-v5-u-display-table-cell")
      .contains(key)
      .parent()
      .next()
      .children("p")
      .should("contain", val);
  }
);

When(
  "I toggle the kebab menu for certificate number {int}",
  (order: number) => {
    cy.get("button[id=card-" + (order - 1) + "]").click();
  }
);

When(
  "in the opened certificate kebab menu, I click on {string} button",
  (buttonName: string) => {
    cy.get("button[role=menuitem]").contains(buttonName).click();
  }
);

Then("I should see value of {string} in the text area", (keyID: string) => {
  let selectedKey = "";
  if (keyID == "valid sample 1") {
    selectedKey = userCert_valid_1.body;
  } else if (keyID == "valid sample 2") {
    selectedKey = userCert_valid_2.body;
  }
  cy.get("textarea[name=usercertificate]")
    .invoke("text")
    .then(($text) => $text.replace(/\n/g, ""))
    .should("contain", selectedKey);
});

Then("file with extension {string} should be downloaded", (ext: string) => {
  // @ts-ignore
  cy.verifyDownload("." + ext, { contains: true });
});

// Certificate mapping data
// - Add certificate mapping data
When("I click on Add key in the Certificate mappings section", () => {
  cy.get('button[name="add-certificate-mapping-data"]').click();
});

When(
  "in the modal dialog I click on {string} button under the Certificate mapping data section",
  (buttonText: string) => {
    cy.get("button[name=add-ipacertmapdata]").contains(buttonText).click();
  }
);

When(
  "I type {string} into the text input in the Certificate mapping data modal",
  (text: string) => {
    cy.get("div.pf-v5-c-form__group-control input[id=cert-map-data]").type(
      text
    );
  }
);

Then(
  "I should see certificate mappings with the {string} text in the Certificate mappings section",
  (text: string) => {
    cy.get("div.pf-v5-c-form__group").contains(text);
  }
);

// - Add multiple certificate mapping data entries from the certificate mapping data radio button
When(
  "I type {string} into the text input with index {int} in the Certificate mapping data modal",
  (text: string, idx: number) => {
    cy.get(
      "div.pf-v5-c-form__group-control input[name=ipacertmapdata-" + idx + "]"
    ).type(text);
  }
);

// - Remove certificate mapping data
When(
  "I click on Delete button for certificate mapping data number {int} in the Certificate mappings section",
  (index: number) => {
    cy.get(
      "button[name=remove-certificate-mapping-data-" + (index - 1) + "]"
    ).click();
  }
);

// - Add Certificate from the 'Certificate mapping data' radio button
When(
  "in the modal dialog I click on Add button under the Certificate subsection",
  () => {
    cy.get("div[name=certificate]").next().click();
  }
);

When(
  "I put Certificate named {string} into the text area with index {int} in the Certificate mapping data modal",
  (certName: string, index: number) => {
    let selectedKey = "";
    if (certName == "valid sample 1") {
      selectedKey = userCert_valid_1.body;
    } else if (certName == "valid sample 2") {
      selectedKey = userCert_valid_2.body;
    }
    cy.get(
      "div.pf-v5-c-form__group-control textarea[name=certificate-" +
        (index - 1) +
        "]"
    ).type(selectedKey, { delay: 0 });
  }
);

// - Add Issuer and object
Then(
  "I type {string} into the {string} text input in the Certificate mapping data modal",
  (text: string, textInputName: string) => {
    cy.get(
      "div.pf-v5-c-form__group-control input[name=" +
        textInputName.toLowerCase() +
        "]"
    ).type(text);
  }
);
