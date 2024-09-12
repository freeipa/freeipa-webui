import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

// General

// direct/indirect button
When("I click on the {string} button", (name: string) => {
  cy.get('button[id="' + name + '"')
    .click()
    .wait(500);
});

// 'Members' section
Given("I click on the Members section", () => {
  cy.get("button[name=member-details]").click();
});

Then(
  "I am on {string} group > Members > {string} section",
  (groupname: string, sectionName: string) => {
    cy.url().then(($url) => {
      if ($url.includes("settings")) {
        cy.get(".pf-v5-c-breadcrumb__item")
          .contains(groupname)
          .should("be.visible");
        cy.get("h1>p").contains(groupname).should("be.visible");
        cy.get("button[name='member-details']")
          .should("have.attr", "aria-selected", "true")
          .contains("Members");
        cy.get("li.pf-v5-c-tabs__item")
          .children()
          .get("button[name='member_group']")
          .contains(sectionName);
        cy.wait(2000);
      }
    });
  }
);

Then("I should see member {string} tab is selected", (tabName: string) => {
  let name = "group";
  switch (tabName) {
    case "Users":
      name = "user";
      break;
    case "User groups":
      name = "group";
      break;
    case "Netgroups":
      name = "netgroup";
      break;
    case "Roles":
      name = "role";
      break;
    case "HBAC rules":
      name = "hbacrule";
      break;
    case "Sudo rules":
      name = "sudorule";
      break;
    case "Hosts":
      name = "host";
      break;
    case "Host groups":
      name = "hostgroup";
      break;
    case "Services":
      name = "service";
      break;
    case "External":
      name = "external";
      break;
    case "User ID overrides":
      name = "idoverrideuser";
      break;
    case "Subordinate ids":
      name = "subid";
      break;
    case "Sudo command groups":
      name = "idoverrideuser";
      break;
    case "HBAC service groups":
      name = "hbacsvcgroup";
      break;
  }
  cy.get("button[name=member_" + name + "]")
    .should("have.attr", "aria-selected", "true")
    .contains(tabName);
});

//
//
// 'Is a member of' section
//
//
Given("I click on the Is a member of section", () => {
  cy.get("button[name=memberof-details]").click();
});

Then(
  "I am on {string} user > Is a member of > {string} section",
  (username: string, sectionName: string) => {
    cy.url().then(($url) => {
      if ($url.includes("settings")) {
        cy.get(".pf-v5-c-breadcrumb__item")
          .contains(username)
          .should("be.visible");
        cy.get("h1>p").contains(username).should("be.visible");
        cy.get("button[name='memberof-details']")
          .should("have.attr", "aria-selected", "true")
          .contains("Is a member of");
        cy.get("li.pf-v5-c-tabs__item")
          .children()
          .get("button[name='memberof_group']")
          .contains(sectionName);
        cy.wait(3000);
      }
    });
  }
);

When(
  "I click on the {string} tab within Is a member of section",
  (tabName: string) => {
    cy.get("button").contains(tabName).click();
  }
);

Then("I should see memberof {string} tab is selected", (tabName: string) => {
  let name = "group";
  switch (tabName) {
    case "User groups":
      name = "group";
      break;
    case "Netgroups":
      name = "netgroup";
      break;
    case "Roles":
      name = "role";
      break;
    case "HBAC rules":
      name = "hbacrule";
      break;
    case "Sudo rules":
      name = "sudorule";
      break;
    case "Hosts":
      name = "host";
      break;
    case "Host groups":
      name = "hostgroup";
      break;
    case "Subordinate ids":
      name = "subid";
      break;
    case "Sudo command groups":
      name = "idoverrideuser";
      break;
    case "HBAC service groups":
      name = "hbacsvcgroup";
      break;
  }

  cy.get("button[name=memberof_" + name + "]")
    .should("have.attr", "aria-selected", "true")
    .contains(tabName);
});

Then("I should see an empty table", () => {
  cy.get("table#membership-table")
    .find("h2.pf-v5-c-empty-state__title-text")
    .contains("No results found");
});

Then("I should see the table with {string} column", (columnName: string) => {
  cy.get("th").contains(columnName).should("be.visible");
});

Then(
  "I should see the element {string} in the table",
  (tableElement: string) => {
    cy.get("table>tbody")
      .find("td")
      .contains(tableElement)
      .should("be.visible");
  }
);

Then(
  "I should not see the element {string} in the table",
  (tableElement: string) => {
    cy.get("table>tbody").find("td").contains(tableElement).should("not.exist");
  }
);

// Member managers, and managed by
Then(
  "I am on {string} group > Member managers > {string} section",
  (groupname: string, sectionName: string) => {
    cy.url().then(($url) => {
      if ($url.includes("settings")) {
        cy.get(".pf-v5-c-breadcrumb__item")
          .contains(groupname)
          .should("be.visible");
        cy.get("h1>p").contains(groupname).should("be.visible");
        cy.get("button[name='manager-details']")
          .should("have.attr", "aria-selected", "true")
          .contains("Member managers");
        cy.get("li.pf-v5-c-tabs__item")
          .children()
          .get("button[name='manager_user']")
          .contains(sectionName);
        cy.wait(2000);
      }
    });
  }
);
