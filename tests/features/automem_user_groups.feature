Feature: Automember > User group rules
  Create and delete automember user group rules. Change default user group rule.

  Background:
    Given I am logged in as "Administrator"
    Given I am on "user-group-rules" page

  # Prep: Create a new user group to work with
  Scenario: Create a new user group to work with
    Given I am on "user-groups" page
    When I click on "Add" button
    * I type in the field "Group name" text "my_automember_group"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    When I close the alert
    Then I should see "my_automember_group" entry in the data table

  # User group rules operations
  Scenario: Add a new automember user group rule
    Given I am on "user-group-rules" page
    When I click on "Add" button
    * I click in the "Automember" selector field
    * I select "my_automember_group" option in the "Automember" selector
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Entry successfully added"
    When I close the alert
    Then I should see "my_automember_group" entry in the data table

  Scenario: Delete an automember user group rule
    Given I am on "user-group-rules" page
    Given I should see "my_automember_group" entry in the data table
    Then I select entry "my_automember_group" in the data table
    When I click on "Delete" button
    * I see "Remove auto membership rules" modal
    * I should see "my_automember_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "The selected rules have been removed successfully"
    When I close the alert
    Then I should not see "my_automember_group" entry in the data table

  Scenario: Set default user group rule
    Given I am on "user-group-rules" page
    When I click in the typeahead selector field with ID "typeahead-select-input"
    * I click toolbar dropdown item "admins"
    Then I see "Default user group" modal
    When I click on the "OK" button located in the footer modal dialog
    Then I should see "success" alert with text "Default group updated"
    When I close the alert
    * in the selector with ID "typeahead-select-input" I should see option "admins" selected

  # Cleanup: Delete the user group
  Scenario: Delete the user group
    Given I am on "user-groups" page
    Given I should see "my_automember_group" entry in the data table
    Then I select entry "my_automember_group" in the data table
    When I click on "Delete" button
    * I see "Remove user groups" modal
    * I should see "my_automember_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "User groups removed"
    When I close the alert
    Then I should not see "my_automember_group" entry in the data table

