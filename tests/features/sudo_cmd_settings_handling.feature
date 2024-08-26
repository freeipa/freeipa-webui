Feature: Sudo cmd settings manipulation
  Modify a sudo command

  Background:
    Given I am logged in as "Administrator"
    Given I am on "sudo-commands" page

  Scenario Outline: Add a new sudo command
    Given I am on "sudo-commands" page
    When I click on "Add" button
    * I type in the field "Command name" text "ls"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command added"
    * I close the alert
    Then I should see "ls" entry in the data table

  Scenario: Set Description
    When I click on "ls" entry in the data table
    Then I click in the field "Description"
    * I type in the textarea "description" text "test"
    Then I click on "Save" button
    * I should see "success" alert with text "Sudo command modified"
    * I close the alert
    Then Then I should see "test" in the textarea "description"
    * I click on the breadcrump link "Sudo commands"

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
