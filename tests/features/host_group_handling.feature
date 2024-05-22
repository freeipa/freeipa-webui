Feature: Host group manipulation
  Create, and delete host groups

  Background:
    Given I am logged in as "Administrator"
    Given I am on "host-groups" page

  Scenario: Add a new host group
    When I click on "Add" button
    * I type in the field "Group name" text "a_host_group"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    Then I should see "a_host_group" entry in the data table

  Scenario: Add a new host group with description
    When I click on "Add" button
    * I type in the field "Group name" text "b_host_group"
    * I type in the field "Description" text "my description"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    Then I should see "b_host_group" entry in the data table
    * entry "b_host_group" should have attribute "Description" set to "my description"

  Scenario: Add one user after another
    When I click on "Add" button
    * I type in the field "Group name" text "c_host_group"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New host group added"
    Then I type in the field "Group name" text "d_host_group"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host group added"
    Then I should see "c_host_group" entry in the data table
    Then I should see "d_host_group" entry in the data table

  Scenario: Delete a group
    Given I should see "a_host_group" entry in the data table
    Then I select entry "a_host_group" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "a_host_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"
    Then I should not see "a_host_group" entry in the data table

  Scenario: Delete many groups
    Given I should see "b_host_group" entry in the data table
    Given I should see "c_host_group" entry in the data table
    Given I should see "d_host_group" entry in the data table
    Then I select entry "b_host_group" in the data table
    Then I select entry "c_host_group" in the data table
    Then I select entry "d_host_group" in the data table
    When I click on "Delete" button
    * I see "Remove host groups" modal
    * I should see "b_host_group" entry in the data table
    * I should see "c_host_group" entry in the data table
    * I should see "d_host_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Host groups removed"
    Then I should not see "b_host_group" entry in the data table
    Then I should not see "c_host_group" entry in the data table
    Then I should not see "d_host_group" entry in the data table

  Scenario: Cancel creation of a group
    When I click on "Add" button
    * I type in the field "Group name" text "cancelgroup"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "cancelgroup" entry in the data table