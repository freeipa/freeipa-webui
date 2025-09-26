import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { entryExists, searchForEntry } from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { loginAsAdmin, logout } from "../common/authentication";
import {
  createDnsZone,
  disableDnsZone,
  isEnabled,
  parseZoneName,
} from "./dnszones";

export const addPermissionToDnsZone = (dnsZoneName: string) => {
  navigateTo("dns-zones/" + dnsZoneName);

  cy.dataCy("dns-zones-settings").should("be.visible");
  cy.dataCy("dns-zones-tab-settings-kebab").click();
  cy.dataCy("dns-zones-tab-settings-kebab-kebab").should("be.visible");

  cy.dataCy("dns-zones-tab-settings-kebab-add-permission")
    .find("button")
    .click();
  cy.dataCy("dns-zones-add-remove-permission-modal").should("be.visible");

  cy.dataCy("modal-button-ok").click();
  cy.dataCy("dns-zones-add-remove-permission-modal").should("not.exist");
  cy.dataCy("success").should("be.visible");
};

export const removePermissionFromDnsZone = (dnsZoneName: string) => {
  navigateTo("dns-zones/" + dnsZoneName);

  cy.dataCy("dns-zones-settings").should("be.visible");
  cy.dataCy("dns-zones-tab-settings-kebab").click();
  cy.dataCy("dns-zones-tab-settings-kebab").should(
    "have.attr",
    "aria-expanded",
    "true"
  );

  cy.dataCy("dns-zones-tab-settings-kebab-remove-permission")
    .find("button")
    .click();
  cy.dataCy("dns-zones-add-remove-permission-modal").should("be.visible");

  cy.dataCy("modal-button-ok").click();
  cy.dataCy("dns-zones-add-remove-permission-modal").should("not.exist");
  cy.dataCy("success").should("be.visible");
};

Given("DNS zone {string} exists and it is enabled", (dnsZoneName: string) => {
  loginAsAdmin();
  navigateTo("dns-zones");

  createDnsZone(dnsZoneName);

  searchForEntry(parseZoneName(dnsZoneName));
  entryExists(parseZoneName(dnsZoneName));
  isEnabled(parseZoneName(dnsZoneName));
  logout();
});

Given("DNS zone {string} exists and it is disabled", (dnsZoneName: string) => {
  loginAsAdmin();
  navigateTo("dns-zones");

  createDnsZone(dnsZoneName);

  searchForEntry(parseZoneName(dnsZoneName));
  entryExists(parseZoneName(dnsZoneName));
  // When creating a DNS zone, it is enabled by default
  disableDnsZone(parseZoneName(dnsZoneName));
  logout();
});

Given("DNS zone {string} exists and has permission", (dnsZoneName: string) => {
  loginAsAdmin();
  navigateTo("dns-zones");

  createDnsZone(dnsZoneName);

  searchForEntry(parseZoneName(dnsZoneName));
  entryExists(parseZoneName(dnsZoneName));
  navigateTo("dns-zones/" + dnsZoneName);
  addPermissionToDnsZone(dnsZoneName);
  logout();
});
