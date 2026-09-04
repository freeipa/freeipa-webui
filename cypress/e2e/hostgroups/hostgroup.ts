import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import {
  entryDoesNotExist,
  entryExists,
  searchForEntry,
  selectEntry,
} from "../common/data_tables";
import { navigateTo } from "../common/navigation";

type MemberType = "member_host" | "member_hostgroup";

type MemberOfType =
  | "memberof_netgroup"
  | "memberof_hbacrule"
  | "memberof_sudorule";

const MEMBERS_TAB_COUNT_MAP = {
  host: "host-groups-tab-member-host-count",
  hostgroup: "host-groups-tab-member-hostgroup-count",
} as const;

type MembersTabName = keyof typeof MEMBERS_TAB_COUNT_MAP;

const addMember = (
  type: MemberType | MemberOfType,
  member: string,
  hostgroup: string
) => {
  switch (type) {
    case "member_host":
      cy.ipa({
        command: "hostgroup-add-member",
        name: hostgroup,
        specificOptions: `--hosts=${member}`,
      });
      break;
    case "member_hostgroup":
      cy.ipa({
        command: "hostgroup-add-member",
        name: hostgroup,
        specificOptions: `--hostgroups=${member}`,
      });
      break;
    case "memberof_netgroup":
      cy.ipa({
        command: "netgroup-add-member",
        name: member,
        specificOptions: `--hostgroups=${hostgroup}`,
      });
      break;
    case "memberof_hbacrule":
      cy.ipa({
        command: "hbacrule-add-host",
        name: member,
        specificOptions: `--hostgroups=${hostgroup}`,
      });
      break;
    case "memberof_sudorule":
      cy.ipa({
        command: "sudorule-add-host",
        name: member,
        specificOptions: `--hostgroups=${hostgroup}`,
      });
      break;
  }
};

const fillHostgroup = (hostgroupName: string, hostgroupDescription: string) => {
  cy.dataCy("modal-textbox-hostgroup-name").type(hostgroupName);
  cy.dataCy("modal-textbox-hostgroup-name").should("have.value", hostgroupName);

  cy.dataCy("modal-textbox-hostgroup-description").type(hostgroupDescription);
  cy.dataCy("modal-textbox-hostgroup-description").should(
    "have.value",
    hostgroupDescription
  );
};

const createHostgroup = (
  hostgroupName: string,
  hostgroupDescription: string
) => {
  cy.dataCy("host-groups-button-add").click();
  cy.dataCy("add-hostgroup-modal").should("exist");

  fillHostgroup(hostgroupName, hostgroupDescription);

  cy.dataCy("modal-button-add").click();
  cy.dataCy("add-hostgroup-modal").should("not.exist");
};

const deleteHostgroup = (hostgroupName: string) => {
  selectEntry(hostgroupName);

  cy.dataCy("host-groups-button-delete").click();
  cy.dataCy("delete-hostgroups-modal").should("exist");

  cy.dataCy("modal-button-delete").click();
  cy.dataCy("delete-hostgroups-modal").should("not.exist");

  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
};

const validateHostgroup = (hostgroupName: string) => {
  searchForEntry(hostgroupName);
  entryExists(hostgroupName);
};

When(
  "I create hostgroup {string} with description {string}",
  (hostgroupName: string, hostgroupDescription: string) => {
    createHostgroup(hostgroupName, hostgroupDescription);
  }
);

Then(
  "I should see hostgroup {string} in the data table",
  (hostgroupName: string) => {
    validateHostgroup(hostgroupName);
  }
);

Then(
  "I should not see hostgroup {string} in the data table",
  (hostgroupName: string) => {
    searchForEntry(hostgroupName);
    entryDoesNotExist(hostgroupName);
  }
);

Given("hostgroup {string} exists", (hostgroupName: string) => {
  cy.ipa({
    command: "hostgroup-add",
    name: hostgroupName,
  });
});

Given(
  "hostgroup {string} with description {string} exists",
  (hostgroupName: string, hostgroupDescription: string) => {
    cy.ipa({
      command: "hostgroup-add",
      name: hostgroupName,
      specificOptions: `--desc="${hostgroupDescription}"`,
    });
  }
);

Given("I delete hostgroup {string}", (hostgroupName: string) => {
  cy.ipa({
    command: "hostgroup-del",
    name: hostgroupName,
  });
});

When("I try to delete hostgroup {string}", (hostgroupName: string) => {
  navigateTo("host-groups");
  deleteHostgroup(hostgroupName);
  searchForEntry(hostgroupName);
  entryDoesNotExist(hostgroupName);
});

Given(
  "host {string} is member of hostgroup {string}",
  (host: string, hostgroup: string) => {
    addMember("member_host", host, hostgroup);
  }
);

Given(
  "hostgroup {string} is member of hostgroup {string}",
  (memberHostgroup: string, hostgroup: string) => {
    addMember("member_hostgroup", memberHostgroup, hostgroup);
  }
);

Given(
  "hostgroup {string} is member of netgroup {string}",
  (hostgroup: string, netgroup: string) => {
    addMember("memberof_netgroup", netgroup, hostgroup);
  }
);

Given(
  "hostgroup {string} is member of hbac rule {string}",
  (hostgroup: string, hbacRule: string) => {
    addMember("memberof_hbacrule", hbacRule, hostgroup);
  }
);

Given(
  "hostgroup {string} is member of sudo rule {string}",
  (hostgroup: string, sudoRule: string) => {
    addMember("memberof_sudorule", sudoRule, hostgroup);
  }
);

Then(
  "I should see the host groups members tab {string} count is {string}",
  (tab: string, count: string) => {
    const dataCy = MEMBERS_TAB_COUNT_MAP[tab as MembersTabName];
    if (!dataCy) {
      throw new Error(
        `Unknown host groups members tab "${tab}". Expected one of: ${Object.keys(MEMBERS_TAB_COUNT_MAP).join(", ")}`
      );
    }

    cy.dataCy("member-of-button-add", { timeout: 30000 }).should("be.visible");
    cy.dataCy(dataCy, { timeout: 20000 })
      .should("be.visible")
      .and("contain.text", count);
  }
);

Given(
  "user {string} is manager of hostgroup {string}",
  (user: string, hostgroup: string) => {
    cy.ipa({
      command: "hostgroup-add-member-manager",
      name: hostgroup,
      specificOptions: `--users=${user}`,
    });
  }
);

Given(
  "I remove user member manager {string} from hostgroup {string}",
  (user: string, hostgroup: string) => {
    cy.ipa({
      command: "hostgroup-remove-member-manager",
      name: hostgroup,
      specificOptions: `--users=${user}`,
    });
  }
);

Given(
  "user group {string} is manager of hostgroup {string}",
  (group: string, hostgroup: string) => {
    cy.ipa({
      command: "hostgroup-add-member-manager",
      name: hostgroup,
      specificOptions: `--groups=${group}`,
    });
  }
);

Given(
  "I remove group member manager {string} from hostgroup {string}",
  (group: string, hostgroup: string) => {
    cy.ipa({
      command: "hostgroup-remove-member-manager",
      name: hostgroup,
      specificOptions: `--groups=${group}`,
    });
  }
);
