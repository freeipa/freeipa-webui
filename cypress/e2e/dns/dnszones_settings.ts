import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import {
  addElementToTextboxList,
  removeAllElementsFromTextboxList,
  removeElementFromTextboxList,
} from "../common/ui/textbox_list";
import { typeInTextbox } from "../common/ui/textbox";

export const checkValueExists = (
  dataCy: string,
  value: string | boolean | number
) => {
  cy.dataCy(dataCy).should("have.value", value);
};

// When clearing a number value, the value is set to 0, which is not what we want
// So we need to adjust the value to the desired value by removing the 0 when typing
export const clearAndAddAdjustedNumberValue = (
  dataCy: string,
  value: string
) => {
  cy.dataCy(dataCy).clear();
  cy.dataCy(dataCy).should("have.value", "0");

  cy.dataCy(dataCy).type(value);
  cy.dataCy(dataCy).type("{backspace}");
};

export const setDnsZoneAuthNameserver = (nameserver: string) => {
  typeInTextbox("dns-zones-tab-settings-textbox-idnssoamname", nameserver);
  checkValueExists("dns-zones-tab-settings-textbox-idnssoamname", nameserver);
};

export const setDnsZoneAdminEmail = (email: string) => {
  typeInTextbox("dns-zones-tab-settings-textbox-idnssoarname", email);
  checkValueExists("dns-zones-tab-settings-textbox-idnssoarname", email);
};

export const setDnsZoneSoaRefresh = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-idnssoarefresh",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-idnssoarefresh", seconds);
};

export const setDnsZoneSoaRetry = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-idnssoaretry",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-idnssoaretry", seconds);
};

export const setDnsZoneSoaExpire = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-idnssoaexpire",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-idnssoaexpire", seconds);
};

export const setDnsZoneSoaMinimum = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-idnssoaminimum",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-idnssoaminimum", seconds);
};

export const setDnsZoneDefaultTtl = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-dnsdefaultttl",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-dnsdefaultttl", seconds);
};

export const setDnsZoneTtl = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-dnsttl",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-dnsttl", seconds);
};

export const setDnsZoneDynamicUpdate = (isDynamicUpdateChecked: boolean) => {
  cy.dataCy("dns-zones-tab-settings-checkbox-idnsallowdynupdate").click();
  checkValueExists(
    "dns-zones-tab-settings-checkbox-idnsallowdynupdate",
    isDynamicUpdateChecked
  );
};

export const setDnsZoneBindUpdatePolicy = (bindUpdatePolicy: string) => {
  typeInTextbox(
    "dns-zones-tab-settings-textbox-idnsupdatepolicy",
    bindUpdatePolicy
  );
  checkValueExists(
    "dns-zones-tab-settings-textbox-idnsupdatepolicy",
    bindUpdatePolicy
  );
};

export const addDnsZoneAllowQuery = (elementToAdd: string) => {
  cy.dataCy("dns-zones-tab-settings-textbox-idnsallowquery-button-add").click();

  cy.dataCy("dns-zones-tab-settings-textbox-idnsallowquery")
    .children()
    .find('[name="value"]')
    .last()
    .find("input")
    .type(elementToAdd);

  cy.dataCy("dns-zones-tab-settings-textbox-idnsallowquery")
    .children()
    .find('div[name="value"]')
    .last()
    .find("input")
    .should("have.value", elementToAdd);
};

export const removeDnsZoneAllowQuery = (queryToRemove: string) => {
  removeElementFromTextboxList(
    queryToRemove,
    "dns-zones-tab-settings-textbox-idnsallowquery"
  );
};

export const addDnsZoneAllowTransfer = (elementToAdd: string) => {
  addElementToTextboxList(
    "dns-zones-tab-settings-textbox-idnsallowtransfer-button-add",
    "dns-zones-tab-settings-textbox-idnsallowtransfer",
    elementToAdd
  );
};

export const removeDnsZoneAllowTransfer = (transferToRemove: string) => {
  removeElementFromTextboxList(
    transferToRemove,
    "dns-zones-tab-settings-textbox-idnsallowtransfer"
  );
};

export const addDnsZoneForwarder = (elementToAdd: string) => {
  cy.dataCy("dns-zones-tab-settings-textbox-idnsforwarders-button-add").click();

  cy.dataCy("dns-zones-tab-settings-textbox-idnsforwarders")
    .children()
    .find('[name="value"]')
    .last()
    .find("input")
    .type(elementToAdd);

  cy.dataCy("dns-zones-tab-settings-textbox-idnsforwarders")
    .children()
    .find('div[name="value"]')
    .last()
    .find("input")
    .should("have.value", elementToAdd);
};

export const removeDnsZoneForwarder = (forwarderToRemove: string) => {
  cy.get(`div[name="value"]:has(input[value="${forwarderToRemove}"])`)
    .find('button:contains("Delete")')
    .click();
  cy.get(`input[value="${forwarderToRemove}"]`).should("not.exist");
};

export const selectDnsZoneForwardPolicyRadio = (forwardPolicyName: string) => {
  const radioButtonName = forwardPolicyName.split("-").pop();
  cy.dataCy(`dns-zone-tab-settings-radio-${radioButtonName}`).should(
    "have.value",
    forwardPolicyName
  );
  cy.dataCy(`dns-zone-tab-settings-radio-${radioButtonName}`).click();
  // Radio button should be selected
  cy.dataCy(`dns-zone-tab-settings-radio-${radioButtonName}`).should(
    "have.attr",
    "checked"
  );
};

export const allowDnsZoneSyncPtr = (isSyncPtrChecked: boolean) => {
  cy.dataCy("dns-zones-tab-settings-checkbox-idnsallowsyncptr").click();
  cy.dataCy("dns-zones-tab-settings-checkbox-idnsallowsyncptr").should(
    "have.value",
    isSyncPtrChecked
  );
};

export const allowDnsZoneInLineDnsSecSigning = (
  isInLineDnsSecSigningChecked: boolean
) => {
  cy.dataCy("dns-zones-tab-settings-checkbox-idnssecinlinesigning").click();
  cy.dataCy("dns-zones-tab-settings-checkbox-idnssecinlinesigning").should(
    "have.value",
    isInLineDnsSecSigningChecked
  );
};

export const setDnsZoneNSecParamRecord = (nsecParamRecord: string) => {
  typeInTextbox(
    "dns-zones-tab-settings-textbox-nsec3paramrecord",
    nsecParamRecord
  );
  checkValueExists(
    "dns-zones-tab-settings-textbox-nsec3paramrecord",
    nsecParamRecord
  );
};

export const clickDnsZoneTableEntry = (dnsZoneName: string) => {
  cy.dataCy(`table-row-${dnsZoneName}-idnsname`).get("a").click();
  cy.url().should("include", dnsZoneName);
};

When("I change auth nameserver field to {string}", (dnsZoneName: string) => {
  setDnsZoneAuthNameserver(dnsZoneName);
});

When("I change admin email field to {string}", (dnsZoneName: string) => {
  setDnsZoneAdminEmail(dnsZoneName);
});

When("I change SOA refresh field to {string}", (seconds: number) => {
  setDnsZoneSoaRefresh(seconds);
});

When("I change SOA retry field to {string}", (seconds: number) => {
  setDnsZoneSoaRetry(seconds);
});

When("I change SOA expire field to {string}", (seconds: number) => {
  setDnsZoneSoaExpire(seconds);
});

When("I change SOA minimum field to {string}", (seconds: number) => {
  setDnsZoneSoaMinimum(seconds);
});

When("I change DNS zone default TTL field to {string}", (seconds: number) => {
  setDnsZoneDefaultTtl(seconds);
});

When("I change TTL field to {string}", (seconds: number) => {
  setDnsZoneTtl(seconds);
});

When("I add allow query {string}", (queryListToAdd: string) => {
  addDnsZoneAllowQuery(queryListToAdd);
});

When("I remove allow query {string}", (queryToRemove: string) => {
  removeDnsZoneAllowQuery(queryToRemove);
});

When("I add allow transfer {string}", (transferToAdd: string) => {
  addDnsZoneAllowTransfer(transferToAdd);
});

When("I remove allow transfer {string}", (transferToRemove: string) => {
  removeDnsZoneAllowTransfer(transferToRemove);
});

When("I add zone forwarder {string}", (forwarderToAdd: string) => {
  addDnsZoneForwarder(forwarderToAdd);
});

When("I try to add invalid NSEC3PARAM record to zone", () => {
  setDnsZoneNSecParamRecord("0 0 0 0 X");
});

When("I try to add invalid Allow Query record to zone", () => {
  addDnsZoneAllowQuery("invalid");
});

When("I try to add invalid zone forwarder to zone", () => {
  addDnsZoneForwarder("invalid");
});

When("I try to add invalid zone allow transfer to zone", () => {
  addDnsZoneAllowTransfer("invalid");
});

Given(
  "I remove all elements from all textbox lists in DNS zone settings",
  () => {
    removeAllElementsFromTextboxList(
      "dns-zones-tab-settings-textbox-idnsallowquery"
    );
    removeAllElementsFromTextboxList(
      "dns-zones-tab-settings-textbox-idnsallowtransfer"
    );
    removeAllElementsFromTextboxList(
      "dns-zones-tab-settings-textbox-idnsforwarders"
    );
  }
);
