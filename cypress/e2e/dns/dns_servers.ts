import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import { loginAsAdmin, logout } from "../common/authentication";
import { navigateTo } from "../common/navigation";
import { searchForEntry } from "../common/data_tables";
import { typeInTextbox } from "../common/ui/textbox";
import {
  addElementToTextboxList,
  removeElementFromTextboxList,
} from "../common/ui/textbox_list";

Given("main DNS server exists", () => {
  navigateTo("dns-servers");
  searchForEntry(Cypress.env("SERVER_NAME"));
});

When("I change SOA name to {string}", (soaName: string) => {
  typeInTextbox("dns-servers-tab-settings-textbox-idnssoamname", soaName);
});

When("I add new forwarder to {string}", (forwarder: string) => {
  addElementToTextboxList(
    "dns-servers-tab-settings-textbox-idnsforwarders-button-add",
    "dns-servers-tab-settings-textbox-idnsforwarders",
    forwarder
  );
});

When("I remove forwarder {string}", (forwarder: string) => {
  removeElementFromTextboxList(
    forwarder,
    "dns-servers-tab-settings-textbox-idnsforwarders"
  );
});
