Feature: Host group settings manipulation
  Modify a host group settings

  Background:
    Given I am logged in as "Administrator"
    Given I am on "host-groups" page

  Scenario: Add a new host group
    When I click on "Add" button
    * I type in the field "Group name" text "my_host_group"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    Then I should see "my_host_group" entry in the data table

  Scenario: Set Description
    Given I am on "host-groups" page
    When I click on "my_host_group" entry in the data table
    Then I click in the field "Description"
    * I type in the textarea "Description" text "my_host_group description here"
    Then I click on "Save" button
    * I should see "success" alert with text "Host group modified"
    Then Then I should see "my_host_group description here" in the textarea "description"

  Scenario: Revert data
    Then I click in the field "Description"
    * I type in the textarea "Description" text "Modifying the description"
    Then I click on "Revert" button
    * I should see "success" alert with text "Host group data reverted"
    Then Then I should see "my_host_group description here" in the textarea "description"

  # Cleanup
  Scenario: Cleanup: Delete the host group
    When I click on the breadcrump link "Host groups"
    Then I should see "my_host_group" entry in the data table
    Then I select entry "my_host_group" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "my_host_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"
    Then I should not see "my_host_group" entry in the data table
