import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { DnsRecordType } from "src/utils/datatypes/globalDataTypes";
import { checkEntry, entryExists, searchForEntry } from "../common/data_tables";
import { navigateTo } from "../common/navigation";
import { loginAsAdmin, logout } from "../common/authentication";
import { clearAndAddAdjustedNumberValue } from "./dnszones_settings";
import { createDnsZone, parseZoneName } from "./dnszones";

const checkNewDnsRecord = (
  dnsRecordName: string,
  type: DnsRecordType | string,
  data: string
) => {
  searchForEntry(dnsRecordName);
  cy.dataCy("table-row-" + dnsRecordName.toLowerCase() + "-idnsname").should(
    "have.text",
    dnsRecordName
  );
  if (type !== "DS, NS" && type !== "NS, DS") {
    cy.dataCy(
      "table-row-" + dnsRecordName.toLowerCase() + "-dnsrecord_types"
    ).should("have.text", type);
    cy.dataCy(
      "table-row-" + dnsRecordName.toLowerCase() + "-dnsrecord_data"
    ).should("have.text", data);
  }
};

const addAndCheckRecord = () => {
  cy.dataCy("add-dns-records-modal-add-button").click();
  cy.dataCy("add-dns-records-modal").should("not.exist");
  cy.dataCy("add-dnsrecord-success").should("be.visible");
};

const addDnsRecordTypeA = (ipAddress: string, createReverse: boolean) => {
  cy.dataCy("modal-text-input-a-part-ip-address").type(ipAddress);
  cy.dataCy("modal-text-input-a-part-ip-address").should(
    "have.value",
    ipAddress
  );

  if (createReverse) {
    cy.dataCy("modal-checkbox-a-extra-create-reverse").click();
    cy.dataCy("modal-checkbox-a-extra-create-reverse").should("be.checked");
  }

  cy.dataCy("add-dns-records-modal-add-button").click();
  cy.dataCy("add-dns-zone-modal").should("not.exist");
  cy.dataCy("add-dnsrecord-success").should("be.visible");
};

const addDnsRecordTypeAAAA = (ipAddress: string, createReverse: boolean) => {
  cy.dataCy("modal-text-input-aaaa-part-ip-address").type(ipAddress);
  cy.dataCy("modal-text-input-aaaa-part-ip-address").should(
    "have.value",
    ipAddress
  );

  if (createReverse) {
    cy.dataCy("modal-checkbox-aaaa-extra-create-reverse").click();
    cy.dataCy("modal-checkbox-aaaa-extra-create-reverse").should("be.checked");
  }

  cy.dataCy("add-dns-records-modal-add-button").click();
  cy.dataCy("add-dns-zone-modal").should("not.exist");
  cy.dataCy("add-dnsrecord-success").should("be.visible");
};

const addDnsRecordTypeA6 = (recordData: string) => {
  cy.dataCy("modal-textarea-a6-part-data").type(recordData);
  cy.dataCy("modal-textarea-a6-part-data").should("have.value", recordData);

  addAndCheckRecord();
};

const addDnsRecordTypeAFSDB = (subtype: string, hostname: string) => {
  clearAndAddAdjustedNumberValue(
    "modal-number-input-afsdb-part-subtype",
    subtype
  );
  cy.dataCy("modal-number-input-afsdb-part-subtype").should(
    "have.value",
    subtype
  );
  cy.dataCy("modal-text-input-afsdb-part-hostname").type(hostname);
  cy.dataCy("modal-text-input-afsdb-part-hostname").should(
    "have.value",
    hostname
  );

  addAndCheckRecord();
};

const addDnsRecordTypeCNAME = (hostname: string) => {
  cy.dataCy("modal-text-input-cname-part-hostname").type(hostname);
  cy.dataCy("modal-text-input-cname-part-hostname").should(
    "have.value",
    hostname
  );

  addAndCheckRecord();
};

const addDnsRecordTypeDNAME = (target: string) => {
  cy.dataCy("modal-text-input-dname-part-target").type(target);
  cy.dataCy("modal-text-input-dname-part-target").should("have.value", target);

  addAndCheckRecord();
};

const addDnsRecordTypeDS = (
  keyTag: string,
  algorithm: string,
  digestType: string,
  digest: string
) => {
  clearAndAddAdjustedNumberValue("modal-number-input-ds-part-key-tag", keyTag);
  cy.dataCy("modal-number-input-ds-part-key-tag").should("have.value", keyTag);

  clearAndAddAdjustedNumberValue(
    "modal-number-input-ds-part-algorithm",
    algorithm
  );
  cy.dataCy("modal-number-input-ds-part-algorithm").should(
    "have.value",
    algorithm
  );

  clearAndAddAdjustedNumberValue(
    "modal-number-input-ds-part-digest-type",
    digestType
  );
  cy.dataCy("modal-number-input-ds-part-digest-type").should(
    "have.value",
    digestType
  );

  clearAndAddAdjustedNumberValue("modal-textarea-ds-part-digest", digest);
  cy.dataCy("modal-textarea-ds-part-digest").should("have.value", digest);

  addAndCheckRecord();
};

const addDnsRecordTypeDLV = (
  keyTag: string,
  algorithm: string,
  digestType: string,
  digest: string
) => {
  clearAndAddAdjustedNumberValue("modal-number-input-dlv-part-key-tag", keyTag);
  cy.dataCy("modal-number-input-dlv-part-key-tag").should("have.value", keyTag);

  clearAndAddAdjustedNumberValue(
    "modal-number-input-dlv-part-algorithm",
    algorithm
  );
  cy.dataCy("modal-number-input-dlv-part-algorithm").should(
    "have.value",
    algorithm
  );

  clearAndAddAdjustedNumberValue(
    "modal-number-input-dlv-part-digest-type",
    digestType
  );
  cy.dataCy("modal-number-input-dlv-part-algorithm").should(
    "have.value",
    algorithm
  );

  clearAndAddAdjustedNumberValue("modal-textarea-dlv-part-digest", digest);
  cy.dataCy("modal-textarea-dlv-part-digest").should("have.value", digest);

  addAndCheckRecord();
};

const addDnsRecordTypeKX = (preference: string, exchanger: string) => {
  clearAndAddAdjustedNumberValue(
    "modal-number-input-kx-part-preference",
    preference
  );
  cy.dataCy("modal-number-input-kx-part-preference").should(
    "have.value",
    preference
  );
  cy.dataCy("modal-text-input-kx-part-exchanger").type(exchanger);
  cy.dataCy("modal-text-input-kx-part-exchanger").should(
    "have.value",
    exchanger
  );

  addAndCheckRecord();
};

const addDnsRecordTypeLOC = (
  latDeg: string,
  latMin: string,
  latSec: string,
  latDir: string,
  lonDeg: string,
  lonMin: string,
  lonSec: string,
  lonDir: string,
  altitude: string,
  size: string,
  horizontalPrecision: string,
  verticalPrecision: string
) => {
  clearAndAddAdjustedNumberValue("modal-number-input-loc-part-lat-deg", latDeg);
  cy.dataCy("modal-number-input-loc-part-lat-deg").should("have.value", latDeg);

  clearAndAddAdjustedNumberValue("modal-number-input-loc-part-lat-min", latMin);
  cy.dataCy("modal-number-input-loc-part-lat-min").should("have.value", latMin);

  clearAndAddAdjustedNumberValue("modal-number-input-loc-part-lat-sec", latSec);
  cy.dataCy("modal-number-input-loc-part-lat-sec").should("have.value", latSec);

  cy.dataCy("modal-radio-loc-part-lat-dir-radio-" + latDir).click();
  cy.dataCy("modal-radio-loc-part-lat-dir-radio-" + latDir).should(
    "be.checked"
  );

  clearAndAddAdjustedNumberValue("modal-number-input-loc-part-lon-deg", lonDeg);
  cy.dataCy("modal-number-input-loc-part-lon-deg").should("have.value", lonDeg);

  clearAndAddAdjustedNumberValue("modal-number-input-loc-part-lon-min", lonMin);
  cy.dataCy("modal-number-input-loc-part-lon-min").should("have.value", lonMin);

  clearAndAddAdjustedNumberValue("modal-number-input-loc-part-lon-sec", lonSec);
  cy.dataCy("modal-number-input-loc-part-lon-sec").should("have.value", lonSec);

  cy.dataCy("modal-radio-loc-part-lon-dir-radio-" + lonDir).click();
  cy.dataCy("modal-radio-loc-part-lon-dir-radio-" + lonDir).should(
    "be.checked"
  );

  clearAndAddAdjustedNumberValue(
    "modal-number-input-loc-part-altitude",
    altitude
  );
  cy.dataCy("modal-number-input-loc-part-altitude").should(
    "have.value",
    altitude
  );

  clearAndAddAdjustedNumberValue("modal-number-input-loc-part-size", size);
  cy.dataCy("modal-number-input-loc-part-size").should("have.value", size);

  clearAndAddAdjustedNumberValue(
    "modal-number-input-loc-part-h-precision",
    horizontalPrecision
  );
  cy.dataCy("modal-number-input-loc-part-h-precision").should(
    "have.value",
    horizontalPrecision
  );

  clearAndAddAdjustedNumberValue(
    "modal-number-input-loc-part-v-precision",
    verticalPrecision
  );
  cy.dataCy("modal-number-input-loc-part-v-precision").should(
    "have.value",
    verticalPrecision
  );

  addAndCheckRecord();
};

const addDnsRecordTypeMX = (preference: string, exchanger: string) => {
  clearAndAddAdjustedNumberValue(
    "modal-number-input-mx-part-preference",
    preference
  );
  cy.dataCy("modal-text-input-mx-part-exchanger").type(exchanger);
  cy.dataCy("modal-text-input-mx-part-exchanger").should(
    "have.value",
    exchanger
  );

  addAndCheckRecord();
};

const addDnsRecordTypeNAPTR = (
  order: string,
  preference: string,
  flags: string,
  service: string,
  regexp: string,
  replacement: string
) => {
  clearAndAddAdjustedNumberValue("modal-number-input-naptr-part-order", order);
  cy.dataCy("modal-number-input-naptr-part-order").should("have.value", order);

  clearAndAddAdjustedNumberValue(
    "modal-number-input-naptr-part-preference",
    preference
  );
  cy.dataCy("modal-number-input-naptr-part-preference").should(
    "have.value",
    preference
  );

  cy.dataCy("modal-select-naptr-part-flags").click();
  cy.dataCy("modal-select-naptr-part-flags").should(
    "have.attr",
    "aria-expanded",
    "true"
  );

  cy.dataCy("modal-select-naptr-part-flags-option-" + flags)
    .first()
    .click();
  cy.dataCy("modal-select-naptr-part-flags").contains(flags);

  cy.dataCy("modal-text-input-naptr-part-service").type(service);
  cy.dataCy("modal-text-input-naptr-part-service").should(
    "have.value",
    service
  );

  cy.dataCy("modal-text-input-naptr-part-regexp").type(regexp);
  cy.dataCy("modal-text-input-naptr-part-regexp").should("have.value", regexp);

  cy.dataCy("modal-text-input-naptr-part-replacement").type(replacement);
  cy.dataCy("modal-text-input-naptr-part-replacement").should(
    "have.value",
    replacement
  );

  addAndCheckRecord();
};

const addDnsRecordTypeNS = (hostname: string, skipDnsCheck: boolean) => {
  cy.dataCy("modal-text-input-ns-part-hostname").type(hostname);
  cy.dataCy("modal-text-input-ns-part-hostname").should("have.value", hostname);

  if (skipDnsCheck) {
    cy.dataCy("modal-checkbox-ns-part-skip-dns-check").click();
    cy.dataCy("modal-checkbox-ns-part-skip-dns-check").should("be.checked");
  }

  addAndCheckRecord();
};

const addDnsRecordTypePTR = (hostname: string) => {
  cy.dataCy("modal-text-input-ptr-part-hostname").type(hostname);
  cy.dataCy("modal-text-input-ptr-part-hostname").should(
    "have.value",
    hostname
  );

  addAndCheckRecord();
};

const addDnsRecordTypeSRV = (
  priority: string,
  weight: string,
  port: string,
  target: string
) => {
  clearAndAddAdjustedNumberValue(
    "modal-number-input-srv-part-priority",
    priority
  );
  cy.dataCy("modal-number-input-srv-part-priority").should(
    "have.value",
    priority
  );

  clearAndAddAdjustedNumberValue("modal-number-input-srv-part-weight", weight);
  cy.dataCy("modal-number-input-srv-part-weight").should("have.value", weight);

  clearAndAddAdjustedNumberValue("modal-number-input-srv-part-port", port);
  cy.dataCy("modal-number-input-srv-part-port").should("have.value", port);

  clearAndAddAdjustedNumberValue("modal-text-input-srv-part-target", target);
  cy.dataCy("modal-text-input-srv-part-target").should("have.value", target);

  addAndCheckRecord();
};

const addDnsRecordTypeSSHFP = (
  algorithm: string,
  fpType: string,
  fingerprint: string
) => {
  clearAndAddAdjustedNumberValue(
    "modal-number-input-sshfp-part-algorithm",
    algorithm
  );
  cy.dataCy("modal-number-input-sshfp-part-algorithm").should(
    "have.value",
    algorithm
  );

  clearAndAddAdjustedNumberValue(
    "modal-number-input-sshfp-part-fp-type",
    fpType
  );
  cy.dataCy("modal-number-input-sshfp-part-fp-type").should(
    "have.value",
    fpType
  );

  cy.dataCy("modal-textarea-sshfp-part-fingerprint").type(fingerprint);
  cy.dataCy("modal-textarea-sshfp-part-fingerprint").should(
    "have.value",
    fingerprint
  );

  cy.dataCy("add-dns-records-modal-add-button").click();
  cy.dataCy("add-dnsrecord-success").should("be.visible");
  cy.dataCy("add-dns-records-modal").should("not.exist");
};

const addDnsRecordTypeTLSA = (
  certUsage: string,
  selector: string,
  matchingType: string,
  certAssociationData: string
) => {
  clearAndAddAdjustedNumberValue(
    "modal-number-input-tlsa-part-cert-usage",
    certUsage
  );
  cy.dataCy("modal-number-input-tlsa-part-cert-usage").should(
    "have.value",
    certUsage
  );

  clearAndAddAdjustedNumberValue(
    "modal-number-input-tlsa-part-selector",
    selector
  );
  cy.dataCy("modal-number-input-tlsa-part-selector").should(
    "have.value",
    selector
  );

  clearAndAddAdjustedNumberValue(
    "modal-number-input-tlsa-part-matching-type",
    matchingType
  );
  cy.dataCy("modal-number-input-tlsa-part-matching-type").should(
    "have.value",
    matchingType
  );

  cy.dataCy("modal-textarea-tlsa-part-cert-association-data").type(
    certAssociationData
  );
  cy.dataCy("modal-textarea-tlsa-part-cert-association-data").should(
    "have.value",
    certAssociationData
  );

  cy.dataCy("add-dns-records-modal-add-button").click();
  cy.dataCy("add-dnsrecord-success").should("be.visible");
  cy.dataCy("add-dns-records-modal").should("not.exist");
};

const addDnsRecordTypeTXT = (data: string) => {
  cy.dataCy("modal-textarea-txt-part-data").type(data);
  cy.dataCy("modal-textarea-txt-part-data").should("have.value", data);

  cy.dataCy("add-dns-records-modal-add-button").click();
  cy.dataCy("add-dnsrecord-success").should("be.visible");
  cy.dataCy("add-dns-records-modal").should("not.exist");
};

const addDnsRecordTypeURI = (
  priority: string,
  weight: string,
  target: string
) => {
  clearAndAddAdjustedNumberValue(
    "modal-number-input-uri-part-priority",
    priority
  );
  cy.dataCy("modal-number-input-uri-part-priority").should(
    "have.value",
    priority
  );

  clearAndAddAdjustedNumberValue("modal-number-input-uri-part-weight", weight);
  cy.dataCy("modal-number-input-uri-part-weight").should("have.value", weight);

  clearAndAddAdjustedNumberValue("modal-text-input-uri-part-target", target);
  cy.dataCy("modal-text-input-uri-part-target").should("have.value", target);

  cy.dataCy("add-dns-records-modal-add-button").click();
  cy.dataCy("add-dnsrecord-success").should("be.visible");
  cy.dataCy("add-dns-records-modal").should("not.exist");
};

const createDnsRecord = (dnsRecordName: string, type: DnsRecordType) => {
  cy.dataCy("add-dns-records").click();
  cy.dataCy("add-dns-records-modal").should("be.visible");

  cy.dataCy("record-name").type(dnsRecordName);
  cy.dataCy("record-name").should("have.value", dnsRecordName);

  cy.dataCy("record-type-toggle").click();
  cy.dataCy("record-type-toggle").should("have.attr", "aria-expanded", "true");
  cy.dataCy("record-type-option")
    .find("span")
    .contains(new RegExp(`^${type}$`))
    .click();
  cy.dataCy("record-type-toggle").find("span").should("have.text", type);

  switch (type) {
    case "A":
      addDnsRecordTypeA("192.168.66.67", false);
      checkNewDnsRecord(dnsRecordName, "A", "192.168.66.67");
      break;
    case "AAAA":
      addDnsRecordTypeAAAA("2001:db8::1", false);
      checkNewDnsRecord(dnsRecordName, "AAAA", "2001:db8::1");
      break;
    case "A6":
      addDnsRecordTypeA6("record data");
      checkNewDnsRecord(dnsRecordName, "A6", "record data");
      break;
    case "AFSDB":
      addDnsRecordTypeAFSDB("1", "hostname");
      checkNewDnsRecord(dnsRecordName, "AFSDB", "1 hostname");
      break;
    case "CNAME":
      addDnsRecordTypeCNAME("hostname.example.com");
      checkNewDnsRecord(dnsRecordName, "CNAME", "hostname.example.com");
      break;
    case "DNAME":
      addDnsRecordTypeDNAME("target.example.com");
      checkNewDnsRecord(dnsRecordName, "DNAME", "target.example.com");
      break;
    case "DS":
      addDnsRecordTypeDS(
        "20326",
        "8",
        "2",
        "E06D44B80B8F1D39A95C0B0D7C65D08458E880409BBC683457104237C7F53853"
      );
      // This is expected to be created alongside a NS record, so both must be present when checking data
      checkNewDnsRecord(
        dnsRecordName,
        "DS, NS",
        "20326 8 2 E06D44B80B8F1D39A95C0B0D7C65D08458E880409BBC683457104237C7F53853, server.ipa.demo"
      );
      break;
    case "DLV":
      addDnsRecordTypeDLV(
        "34505",
        "8",
        "2",
        "A3746E9665885C21431E75193239C6A481B23E3905553655CE9C2DD4C02F2393"
      );
      checkNewDnsRecord(
        dnsRecordName,
        "DLV",
        "34505 8 2 A3746E9665885C21431E75193239C6A481B23E3905553655CE9C2DD4C02F2393"
      );
      break;
    case "KX":
      addDnsRecordTypeKX("10", "exchanger.example.com");
      checkNewDnsRecord(dnsRecordName, "KX", "10 exchanger.example.com");
      break;
    case "LOC":
      addDnsRecordTypeLOC(
        "40",
        "0",
        "0",
        "N",
        "74",
        "0",
        "0",
        "W",
        "0",
        "100",
        "10",
        "10"
      );
      checkNewDnsRecord(dnsRecordName, "LOC", "40 0 0 N 74 0 0 W 0 100 10 10");
      break;
    case "MX":
      addDnsRecordTypeMX("10", "mail.example.com");
      checkNewDnsRecord(dnsRecordName, "MX", "10 mail.example.com");
      break;
    case "NAPTR":
      addDnsRecordTypeNAPTR("100", "10", "U", "sip", ".*", "sip.example.com");
      checkNewDnsRecord(
        dnsRecordName,
        "NAPTR",
        "100 10 U sip .* sip.example.com"
      );
      break;
    case "NS":
      addDnsRecordTypeNS("server.ipa.demo", true);
      checkNewDnsRecord(dnsRecordName, "NS", "server.ipa.demo");
      break;
    case "PTR":
      addDnsRecordTypePTR("hostname.example.com");
      checkNewDnsRecord(dnsRecordName, "PTR", "hostname.example.com");
      break;
    case "SRV":
      addDnsRecordTypeSRV("10", "5", "8080", "target.example.com");
      checkNewDnsRecord(dnsRecordName, "SRV", "10 5 8080 target.example.com");
      break;
    case "SSHFP":
      addDnsRecordTypeSSHFP(
        "1",
        "1",
        "d4b01d51ebe9c82a2e8b92425a8c9fc2b818f2e3"
      );
      checkNewDnsRecord(
        dnsRecordName,
        "SSHFP",
        "1 1 d4b01d51ebe9c82a2e8b92425a8c9fc2b818f2e3"
      );
      break;
    case "TLSA":
      addDnsRecordTypeTLSA("1", "1", "1", "data");
      checkNewDnsRecord(dnsRecordName, "TLSA", "1 1 1 data");
      break;
    case "TXT":
      addDnsRecordTypeTXT("text record data");
      checkNewDnsRecord(dnsRecordName, "TXT", "text record data");
      break;
    case "URI":
      addDnsRecordTypeURI("10", "5", "https://example.com");
      checkNewDnsRecord(dnsRecordName, "URI", '10 5 "https://example.com"');
      break;
  }
};

When(
  "I create a DNS record {DnsRecordType} with name {string}",
  (recordType: DnsRecordType, recordName: string) => {
    createDnsRecord(recordName, recordType);
  }
);

When("I delete DNS record {string}", (recordName: string) => {
  checkEntry(recordName);
  cy.dataCy("delete-dns-records").click();
  cy.dataCy("modal-delete-dns-records").should("be.visible");
  cy.dataCy("modal-button-delete").click();
  cy.dataCy("modal-delete-dns-records").should("not.exist");
  cy.dataCy("remove-dnsrecords-success").should("be.visible");
});

Then(
  "I should see DNS record {string} with type {string} and data {string}",
  (recordName: string, recordType: DnsRecordType, recordData: string) => {
    checkNewDnsRecord(recordName, recordType, recordData);
  }
);

Then("I should not see DNS record {string}", (recordName: string) => {
  cy.dataCy("dns-zones-dns-records-table").should("not.contain", recordName);
});

Given(
  "DNS zone {string} exists and has record {string} with name {string} and data {string}",
  (
    dnsZoneName: string,
    recordType: DnsRecordType,
    recordName: string,
    recordData: string
  ) => {
    loginAsAdmin();
    navigateTo("dns-zones");

    createDnsZone(dnsZoneName);
    searchForEntry(parseZoneName(dnsZoneName));
    entryExists(parseZoneName(dnsZoneName));

    navigateTo("dns-zones/" + dnsZoneName + "./dns-records");
    createDnsRecord(recordName, recordType);
    checkNewDnsRecord(recordName, recordType, recordData);
    logout();
  }
);
