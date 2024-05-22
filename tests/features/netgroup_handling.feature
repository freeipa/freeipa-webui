Feature: Netgroup manipulation
  Create, and delete netgroups

  Background:
    Given I am logged in as "Administrator"
    Given I am on "netgroups" page

  Scenario: Add a new netgroup
    When I click on "Add" button
    * I type in the field "Netgroup name" text "a_net_group"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New netgroup added"
    Then I should see "a_net_group" entry in the data table

  Scenario: Add a new netgroup with description
    When I click on "Add" button
    * I type in the field "Netgroup name" text "b_net_group"
    * I type in the field "Description" text "my description"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New netgroup added"
    Then I should see "b_net_group" entry in the data table
    * entry "b_net_group" should have attribute "Description" set to "my description"

  Scenario: Add one user after another
    When I click on "Add" button
    * I type in the field "Netgroup name" text "c_net_group"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New netgroup added"
    Then I type in the field "Netgroup name" text "d_net_group"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New netgroup added"
    Then I should see "c_net_group" entry in the data table
    Then I should see "d_net_group" entry in the data table

  Scenario: Delete a group
    Given I should see "a_net_group" entry in the data table
    Then I select entry "a_net_group" in the data table
    When I click on "Delete" button
    * I see "Remove netgroups" modal
    * I should see "a_net_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Netgroups removed"
    Then I should not see "a_net_group" entry in the data table

  Scenario: Delete many groups
    Given I should see "b_net_group" entry in the data table
    Given I should see "c_net_group" entry in the data table
    Given I should see "d_net_group" entry in the data table
    Then I select entry "b_net_group" in the data table
    Then I select entry "c_net_group" in the data table
    Then I select entry "d_net_group" in the data table
    When I click on "Delete" button
    * I see "Remove netgroups" modal
    * I should see "b_net_group" entry in the data table
    * I should see "c_net_group" entry in the data table
    * I should see "d_net_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Netgroups removed"
    Then I should not see "b_net_group" entry in the data table
    Then I should not see "c_net_group" entry in the data table
    Then I should not see "d_net_group" entry in the data table

  Scenario: Cancel creation of a group
    When I click on "Add" button
    * I type in the field "Netgroup name" text "cancelgroup"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "cancelgroup" entry in the data table