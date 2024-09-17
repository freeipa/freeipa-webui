Feature: Sudo command group members
  Work with Members section and its operations

  Background:
    Given I am logged in as "Administrator"
    Given I am on "sudo-command-groups" page

  #
  # Create test entries
  #
  Scenario Outline: Add a new sudo command
    Given I am on "sudo-commands" page
    When I click on "Add" button
    * I type in the field "Command name" text "ls"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command added"
    * I close the alert
    Then I should see "ls" entry in the data table

  Given I am on "sudo-command-groups" page
    When I click on "Add" button
    * I type in the field "Command group name" text "group1"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command group added"
    * I close the alert
    Then I should see "group1" entry in the data table

  #
  # Test Sudo command groups members
  #
  Scenario: Add a Sudo command member
    Given I click on "group1" entry in the data table
    Given I click on "Members" page tab
    Given I am on "group1" group > Members > "HBAC services" section
    Then I should see the "cmd" tab count is "0"
    When I click on "Add" button located in the toolbar
    Then I should see the dialog with title "Assign sudo command members to: group1"
    When I move user "ls" from the available list and move it to the chosen options
    And in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Assigned new sudo command members to 'group1'"
    * I close the alert
    Then I should see the element "ls" in the table
    Then I should see the "cmd" tab count is "1"

  Scenario: Search for a command
    When I type "ls" in the search field
    Then I should see the "ls" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "ls" in the table
    * I click on the X icon to clear the search field
    When I type "notthere" in the search field
    Then I should see the "notthere" text in the search input field
    When I click on the arrow icon to perform search
    Then I should not see the element "ls" in the table
    * I click on the X icon to clear the search field
    Then I click on the arrow icon to perform search

  Scenario: Remove command member
    When I select entry "ls" in the data table
    And I click on "Delete" button located in the toolbar
    Then I should see the dialog with title "Delete sudo command members from: group1"
    And the "ls" element should be in the dialog table
    When in the modal dialog I click on "Delete" button
    Then I should see "success" alert with text "Removed sudo command members from 'group1'"
    * I close the alert
    And I should not see the element "ls" in the table
    Then I should see the "cmd" tab count is "0"

#
# Cleanup entries
#
Scenario: Cleanup - delete a command group
  When I click on the breadcrump link "Sudo command groups"
  Given I am on "sudo-command-groups" page
  Given I should see "group1" entry in the data table
  When I select entry "group1" in the data table
  * I click on "Delete" button
  When I see "Remove sudo command groups" modal
  * I should see "group1" entry in the data table
  * in the modal dialog I click on "Delete" button
  * I should see "success" alert with text "Sudo command groups removed"
  * I close the alert
  Then I should not see "group1" entry in the data table

Scenario: Cleanup - delete a command
  Given I am on "sudo-commands" page
  Given I should see "ls" entry in the data table
  When I select entry "ls" in the data table
  * I click on "Delete" button
  When I see "Remove sudo commands" modal
  * I should see "ls" entry in the data table
  * in the modal dialog I click on "Delete" button
  * I should see "success" alert with text "Sudo commands removed"
  * I close the alert
  Then I should not see "ls" entry in the data table
