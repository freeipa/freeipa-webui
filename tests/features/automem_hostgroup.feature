Feature: Automember > Host group rules
  Create and delete automember host group rules. Change default host group rule.

  Background:
    Given I am logged in as "Administrator"
    Given I am on "host-group-rules" page

  # Prep: Create a new host group to work with
  Scenario: Create a new host group to work with
    Given I am on "host-groups" page
    When I click on "Add" button
    * I type in the field "Group name" text "my_automember_hostgroup"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    When I close the alert
    Then I should see "my_automember_hostgroup" entry in the data table

  # Host group rules operations
  Scenario: Add a new automember host group rule
    Given I am on "host-group-rules" page
    When I click on "Add" button
    * I click in the "Automember" selector field
    * I select "my_automember_hostgroup" option in the "Automember" selector
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Entry successfully added"
    When I close the alert
    Then I should see "my_automember_hostgroup" entry in the data table

  Scenario: Add another automember host group rule
    Given I am on "host-group-rules" page
    When I click on "Add" button
    * I click in the "Automember" selector field
    * I select "ipaservers" option in the "Automember" selector
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Entry successfully added"
    When I close the alert
    Then I should see "ipaservers" entry in the data table

  Scenario: Delete an automember host group rule
    Given I am on "host-group-rules" page
    Given I should see "my_automember_hostgroup" entry in the data table
    Then I select entry "my_automember_hostgroup" in the data table
    When I click on "Delete" button
    * I see "Remove auto membership rules" modal
    * I should see "my_automember_hostgroup" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "The selected rules have been removed successfully"
    When I close the alert
    Then I should not see "my_automember_hostgroup" entry in the data table

  Scenario: Delete another automember host group rule
    Given I am on "host-group-rules" page
    Given I should see "ipaservers" entry in the data table
    Then I select entry "ipaservers" in the data table
    When I click on "Delete" button
    * I see "Remove auto membership rules" modal
    * I should see "ipaservers" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "The selected rules have been removed successfully"
    When I close the alert
    Then I should not see "ipaservers" entry in the data table

  Scenario: Set default host group rule
    Given I am on "host-group-rules" page
    When I click in the typeahead selector field with ID "typeahead-select-input"
    * I click toolbar dropdown item "ipaservers"
    Then I see "Default hostgroup" modal
    When I click on the "OK" button located in the footer modal dialog
    Then I should see "success" alert with text "Default group updated"
    When I close the alert
    * in the selector with ID "typeahead-select-input" I should see option "ipaservers" selected

  # Cleanup: Delete the host group
  Scenario: Delete the host group
    Given I am on "host-groups" page
    Given I should see "my_automember_hostgroup" entry in the data table
    Then I select entry "my_automember_hostgroup" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "my_automember_hostgroup" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"
    When I close the alert
    Then I should not see "my_automember_hostgroup" entry in the data table

