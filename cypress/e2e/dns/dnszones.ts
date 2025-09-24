import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import {
  entryExists,
  entryDoesNotExist,
  searchForEntry,
  selectEntry,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { loginAsAdmin, logout } from "../common/authentication";

export const fillDnsZone = (zone: string) => {
  cy.dataCy("modal-textbox-dns-zone-name").type(zone);
  cy.dataCy("modal-textbox-dns-zone-name").should("have.value", zone);
};

export const fillReversedDnsZone = (ip: string) => {
  cy.dataCy("modal-textbox-reverse-zone-ip").type(ip);
  cy.dataCy("modal-textbox-reverse-zone-ip").should("have.value", ip);
};

export const fillDnsZoneWithSkipOverlapCheck = (zone: string) => {
  fillDnsZone(zone);
  cy.dataCy("modal-checkbox-skip-overlap-check").click();
  cy.dataCy("modal-checkbox-skip-overlap-check").should("be.checked");
};

export const fillReversedDnsZoneWithSkipOverlapCheck = (ip: string) => {
  fillReversedDnsZone(ip);
  cy.dataCy("modal-checkbox-skip-overlap-check").click();
  cy.dataCy("modal-checkbox-skip-overlap-check").should("be.checked");
};

export const createDnsZone = (zone: string) => {
  cy.dataCy("dns-zones-button-add").click();
  cy.dataCy("add-dns-zone-modal").should("exist");

  fillDnsZone(zone);

  cy.intercept({ method: "POST", url: "**/ipa/session/json" }, (req) => {
    if (req.body.method === "dnszone_add") {
      req.alias = "apiCall";
    }
  });
  cy.dataCy("modal-button-add").click();
  cy.wait("@apiCall");
  cy.dataCy("add-dns-zone-modal").should("not.exist");
};

export const createReversedDnsZone = (ip: string) => {
  cy.dataCy("dns-zones-button-add").click();
  cy.dataCy("add-dns-zone-modal").should("exist");
  cy.dataCy("modal-radio-reverse-zone-ip").click();
  cy.dataCy("modal-radio-reverse-zone-ip").should("be.checked");

  fillReversedDnsZone(ip);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-dns-zone-modal").should("not.exist");
};

export const createDnsZoneWithSkipOverlapCheck = (zone: string) => {
  cy.dataCy("dns-zones-button-add").click();
  cy.dataCy("add-dns-zone-modal").should("exist");

  fillDnsZoneWithSkipOverlapCheck(zone);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-dns-zone-modal").should("not.exist");
};

export const createReversedDnsZoneWithSkipOverlapCheck = (ip: string) => {
  cy.dataCy("dns-zones-button-add").click();
  cy.dataCy("add-dns-zone-modal").should("exist");
  cy.dataCy("modal-radio-reverse-zone-ip").click();
  cy.dataCy("modal-radio-reverse-zone-ip").should("be.checked");

  fillReversedDnsZoneWithSkipOverlapCheck(ip);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-dns-zone-modal").should("not.exist");
};

export const deleteDnsZone = (zoneName: string) => {
  selectEntry(zoneName);

  cy.dataCy("dns-zones-button-delete").click();
  cy.dataCy("dns-zones-delete-modal").should("exist");

  cy.dataCy("modal-button-ok").click();
  cy.dataCy("dns-zones-delete-modal").should("not.exist");
};

export const isDisabled = (name: string) => {
  cy.get("tr[id='" + name + "'] td[data-label=idnszoneactive]").contains(
    "Disabled"
  );
};

export const isEnabled = (name: string) => {
  cy.get("tr[id='" + name + "'] td[data-label=idnszoneactive]").contains(
    "Enabled"
  );
};

export const disableDnsZone = (zoneName: string) => {
  selectEntry(zoneName);

  cy.dataCy("dns-zones-button-disable").click();
  cy.dataCy("dns-zones-enable-disable-modal").should("exist");
  cy.dataCy("modal-button-ok").click();
  cy.dataCy("dns-zones-enable-disable-modal").should("not.exist");

  isDisabled(zoneName);
};

export const enableDnsZone = (zoneName: string) => {
  selectEntry(zoneName);

  cy.dataCy("dns-zones-button-enable").click();
  cy.dataCy("dns-zones-enable-disable-modal").should("exist");
  cy.dataCy("modal-button-ok").click();
  cy.dataCy("dns-zones-enable-disable-modal").should("not.exist");

  isEnabled(zoneName);
};

// E.g. "my-dnszone" -> "my-dnszone."
export const parseZoneName = (zoneName: string) => {
  return zoneName + ".";
};

When("I create a DNS zone {string}", (zoneName: string) => {
  createDnsZone(zoneName);
});

When("I create a reverse DNS zone {string}", (ip: string) => {
  createReversedDnsZone(ip);
});

Given("I delete DNS zone {string}", (zoneName: string) => {
  loginAsAdmin();
  navigateTo("dns-zones");

  deleteDnsZone(zoneName);

  searchForEntry(zoneName);
  entryDoesNotExist(zoneName);
  logout();
});

When(
  "I create a DNS zone {string} with skip overlap check",
  (zoneName: string) => {
    createDnsZoneWithSkipOverlapCheck(zoneName);
  }
);

When(
  "I create a reverse DNS zone {string} with skip overlap check",
  (ip: string) => {
    createReversedDnsZoneWithSkipOverlapCheck(ip);
  }
);

Then("I should see DNS zone {string} in the list", (zoneName: string) => {
  entryExists(zoneName);
});

Then("I should not see DNS zone {string} in the list", (zoneName: string) => {
  searchForEntry(zoneName);
  entryDoesNotExist(zoneName);
});

Given("DNS zone {string} exists", (zoneName: string) => {
  loginAsAdmin();
  navigateTo("dns-zones");

  createDnsZone(zoneName);

  searchForEntry(parseZoneName(zoneName));
  entryExists(parseZoneName(zoneName));
  logout();
});

Then(
  "I should see DNS zone {string} in the list disabled",
  (zoneName: string) => {
    isDisabled(zoneName);
  }
);

Then(
  "I should see DNS zone {string} in the list enabled",
  (zoneName: string) => {
    isEnabled(zoneName);
  }
);

When("I cancel the creation of the {string} DNS zone", (zoneName: string) => {
  cy.dataCy("dns-zones-button-add").click();
  cy.dataCy("add-dns-zone-modal").should("exist");

  fillDnsZone(zoneName);

  cy.dataCy("modal-button-cancel").click();
  cy.dataCy("add-dns-zone-modal").should("not.exist");
});

When("I disable DNS zone {string}", (zoneName: string) => {
  disableDnsZone(zoneName);
});

When("I enable DNS zone {string}", (zoneName: string) => {
  enableDnsZone(zoneName);
});

Then("I close the add DNS zone modal", () => {
  cy.dataCy("modal-button-cancel").click();
  cy.dataCy("add-dns-zone-modal").should("not.exist");
});

When(
  "I create an invalid DNS reverse zone that triggers a validation error",
  () => {
    cy.dataCy("dns-zones-button-add").click();
    cy.dataCy("add-dns-zone-modal").should("exist");

    cy.dataCy("modal-radio-reverse-zone-ip").click();
    cy.dataCy("modal-radio-reverse-zone-ip").should("be.checked");
    cy.dataCy("modal-textbox-reverse-zone-ip").type("192.168.1.xx");
    cy.dataCy("modal-textbox-reverse-zone-ip").should(
      "have.value",
      "192.168.1.xx"
    );
    cy.dataCy("modal-textbox-reverse-zone-ip").should(
      "have.attr",
      "aria-invalid",
      "true"
    );

    cy.dataCy("modal-button-add").click();
    cy.dataCy("add-dns-zone-modal").should("exist");
    cy.dataCy("modal-textbox-reverse-zone-ip").should(
      "have.attr",
      "aria-invalid",
      "true"
    );
  }
);
