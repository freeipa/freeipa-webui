import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import {
  addElementToTextboxList,
  removeAllElementsFromTextboxList,
  removeElementFromTextboxList,
} from "../common/ui/textbox_list";
import { typeInTextbox } from "../common/ui/textbox";

const checkValueExists = (dataCy: string, value: string | boolean | number) => {
  cy.dataCy(dataCy).should("have.value", value);
};

// When clearing a number value, the value is set to 0, which is not what we want
// So we need to adjust the value to the desired value by removing the 0 when typing
export const clearAndAddAdjustedNumberValue = (
  dataCy: string,
  value: string
) => {
  cy.dataCy(dataCy).type("{selectall}");
  cy.dataCy(dataCy).type(value);
};

const setDnsZoneAuthNameserver = (nameserver: string) => {
  typeInTextbox("dns-zones-tab-settings-textbox-idnssoamname", nameserver);
  checkValueExists("dns-zones-tab-settings-textbox-idnssoamname", nameserver);
};

const setDnsZoneAdminEmail = (email: string) => {
  typeInTextbox("dns-zones-tab-settings-textbox-idnssoarname", email);
  checkValueExists("dns-zones-tab-settings-textbox-idnssoarname", email);
};

const setDnsZoneSoaRefresh = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-idnssoarefresh",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-idnssoarefresh", seconds);
};

const setDnsZoneSoaRetry = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-idnssoaretry",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-idnssoaretry", seconds);
};

const setDnsZoneSoaExpire = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-idnssoaexpire",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-idnssoaexpire", seconds);
};

const setDnsZoneSoaMinimum = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-idnssoaminimum",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-idnssoaminimum", seconds);
};

const setDnsZoneDefaultTtl = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-dnsdefaultttl",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-dnsdefaultttl", seconds);
};

const setDnsZoneTtl = (seconds: number) => {
  clearAndAddAdjustedNumberValue(
    "dns-zones-tab-settings-textbox-dnsttl",
    seconds.toString()
  );
  checkValueExists("dns-zones-tab-settings-textbox-dnsttl", seconds);
};

const addDnsZoneAllowQuery = (elementToAdd: string) => {
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

const removeDnsZoneAllowQuery = (queryToRemove: string) => {
  removeElementFromTextboxList(
    queryToRemove,
    "dns-zones-tab-settings-textbox-idnsallowquery"
  );
};

const addDnsZoneAllowTransfer = (elementToAdd: string) => {
  addElementToTextboxList(
    "dns-zones-tab-settings-textbox-idnsallowtransfer-button-add",
    "dns-zones-tab-settings-textbox-idnsallowtransfer",
    elementToAdd
  );
};

const removeDnsZoneAllowTransfer = (transferToRemove: string) => {
  removeElementFromTextboxList(
    transferToRemove,
    "dns-zones-tab-settings-textbox-idnsallowtransfer"
  );
};

const addDnsZoneForwarder = (elementToAdd: string) => {
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

const setDnsZoneNSecParamRecord = (nsecParamRecord: string) => {
  typeInTextbox(
    "dns-zones-tab-settings-textbox-nsec3paramrecord",
    nsecParamRecord
  );
  checkValueExists(
    "dns-zones-tab-settings-textbox-nsec3paramrecord",
    nsecParamRecord
  );
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
