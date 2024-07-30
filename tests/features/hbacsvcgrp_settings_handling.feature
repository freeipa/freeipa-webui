Feature: HBAC service group settings manipulation
  Modify a hbac service group

  Background:
    Given I am logged in as "Administrator"
    Given I am on "hbac-service-groups" page

  Scenario Outline: Add a new service
    Given I am on "hbac-service-groups" page
    When I click on "Add" button
    * I type in the field "Service group name" text "a_service_group"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New HBAC service group added"
    Then I should see "a_service_group" entry in the data table

  Scenario: Set Description
    When I click on "a_service_group" entry in the data table
    Then I click in the field "Description"
    * I type in the textarea "description" text "test"
    Then I click on "Save" button
    * I should see "success" alert with text "HBAC service group modified"
    * I close the alert
    Then Then I should see "test" in the textarea "description"
    * I click on the breadcrump link "HBAC service groups"

  Scenario: Delete a service
    Given I should see partial "a_service_group" entry in the data table
    When I select entry "a_service_group" in the data table
    * I click on "Delete" button
    When I see "Remove HBAC service group" modal
    * I should see "a_service_group" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "HBAC service groups removed"
    Then I should not see "a_service_group" entry in the data table