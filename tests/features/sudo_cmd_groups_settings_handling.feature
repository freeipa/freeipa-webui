Feature: Sudo cmd groupsettings manipulation
  Modify a sudo command group

  Background:
    Given I am logged in as "Administrator"
    Given I am on "sudo-command-groups" page

  Scenario Outline: Add a new sudo command group
    Given I am on "sudo-command-groups" page
    When I click on "Add" button
    * I type in the field "Command group name" text "lsgroup"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New sudo command group added"
    * I close the alert
    Then I should see "lsgroup" entry in the data table

  Scenario: Set Description
    When I click on "lsgroup" entry in the data table
    Then I click in the field "Description"
    * I type in the textarea "description" text "test"
    Then I click on "Save" button
    * I should see "success" alert with text "Sudo command group modified"
    * I close the alert
    Then Then I should see "test" in the textarea "description"
    * I click on the breadcrump link "Sudo command groups"

  Scenario: Delete a command group
    Given I should see "lsgroup" entry in the data table
    When I select entry "lsgroup" in the data table
    * I click on "Delete" button
    When I see "Remove sudo command groups" modal
    * I should see "lsgroup" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Sudo command groups removed"
    * I close the alert
    Then I should not see "lsgroup" entry in the data table
