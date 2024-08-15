
Feature: Sudo commands manipulation
  Create and delete Sudo commands

  Background:
    Given I am logged in as "Administrator"
    Given I am on "sudo-commands" page

  Scenario Outline: Add a new sudo command
    Given I am on "sudo-commands" page
    When I click on "Add" button
    * I type in the field "Command name" text "ls"
    * I type in the field "Description" text "my description"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command added"
    * I close the alert
    Then I should see "ls" entry in the data table
    * entry "ls" should have attribute "Description" set to "my description"

  Scenario Outline: Add several commands
    When I click on "Add" button
    * I type in the field "Command name" text "cp"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New sudo command added"
    * I close the alert
    * I type in the field "Command name" text "rm"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command added"
    * I close the alert
    Then I should see "cp" entry in the data table
    Then I should see "rm" entry in the data table

  Scenario Outline: Search for a command
    When I type "rm" in the search field
    Then I should see the "rm" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "rm" in the table
    And I should not see the element "cp" in the table
    Then I click on the X icon to clear the search field
    When I click on the arrow icon to perform search
    Then I should see the element "cp" in the table

  Scenario: Delete a command
    Given I should see "ls" entry in the data table
    When I select entry "ls" in the data table
    * I click on "Delete" button
    When I see "Remove sudo commands" modal
    * I should see "ls" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo commands removed"
    * I close the alert
    Then I should not see "ls" entry in the data table

  Scenario: Delete many commands
    Given I should see "cp" entry in the data table
    Given I should see "rm" entry in the data table
    Then I select entry "cp" in the data table
    Then I select entry "rm" in the data table
    When I click on "Delete" button
    * I see "Remove sudo commands" modal
    * I should see partial "cp" entry in the data table
    * I should see partial "rm" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo commands removed"
    * I close the alert
    Then I should not see "cp" entry in the data table
    Then I should not see "rm" entry in the data table

  Scenario: Cancel creation of a command
    When I click on "Add" button
    * I type in the field "Command name" text "cmd-cancel"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "cmd-cancel" entry in the data table

