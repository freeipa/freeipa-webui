Feature: Sudo command groups manipulation
  Create and delete Sudo command groups

  Background:
    Given I am logged in as "Administrator"
    Given I am on "sudo-command-groups" page

  Scenario Outline: Add a new sudo command group
    Given I am on "sudo-command-groups" page
    When I click on "Add" button
    * I type in the field "Command group name" text "group1"
    * I type in the field "Description" text "my description"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command group added"
    * I close the alert
    Then I should see "group1" entry in the data table
    * entry "group1" should have attribute "Description" set to "my description"

  Scenario Outline: Add several command groupss
    When I click on "Add" button
    * I type in the field "Command group name" text "group2"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New sudo command group added"
    * I close the alert
    * I type in the field "Command group name" text "group3"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command group added"
    * I close the alert
    Then I should see "group2" entry in the data table
    Then I should see "group3" entry in the data table

  Scenario Outline: Search for a command group
    When I type "group3" in the search field
    Then I should see the "group3" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "group3" in the table
    And I should not see the element "group1" in the table
    Then I click on the X icon to clear the search field
    When I click on the arrow icon to perform search
    Then I should see the element "group1" in the table

  Scenario: Delete a command group
    Given I should see "group1" entry in the data table
    When I select entry "group1" in the data table
    * I click on "Delete" button
    When I see "Remove sudo command groups" modal
    * I should see "group1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo command groups removed"
    * I close the alert
    Then I should not see "group1" entry in the data table

  Scenario: Delete many command groups
    Given I should see "group2" entry in the data table
    Given I should see "group3" entry in the data table
    Then I select entry "group2" in the data table
    Then I select entry "group3" in the data table
    When I click on "Delete" button
    * I see "Remove sudo command groups" modal
    * I should see partial "group2" entry in the data table
    * I should see partial "group3" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo command groups removed"
    * I close the alert
    Then I should not see "group2" entry in the data table
    Then I should not see "group3" entry in the data table

  Scenario: Cancel creation of a command group
    When I click on "Add" button
    * I type in the field "Command group name" text "cmd-group-cancel"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "cmd-group-cancel" entry in the data table