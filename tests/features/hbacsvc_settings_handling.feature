Feature: HBAC service settings manipulation
  Modify a hbac service

  Background:
    Given I am logged in as "Administrator"
    Given I am on "hbac-services" page

  Scenario Outline: Add a new service
    Given I am on "hbac-services" page
    When I click on "Add" button
    * I type in the field "Service name" text "a_service1"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New HBAC service added"
    Then I should see "a_service1" entry in the data table

  Scenario: Set Description
    When I click on "a_service1" entry in the data table
    Then I click in the field "Description"
    * I type in the textarea "description" text "test"
    Then I click on "Save" button
    * I should see "success" alert with text "HBAC service modified"
    * I close the alert
    Then Then I should see "test" in the textarea "description"
    * I click on the breadcrump link "HBAC services"

  Scenario: Delete a service
    Given I should see partial "a_service1" entry in the data table
    When I select entry "a_service1" in the data table
    * I click on "Delete" button
    When I see "Remove HBAC service" modal
    * I should see "a_service1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "HBAC services removed"
    Then I should not see "a_service1" entry in the data table