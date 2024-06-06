Feature: HBAC service groups manipulation
  Create and delete HBAC service groups

  Background:
    Given I am logged in as "Administrator"
    Given I am on "hbac-service-groups" page

  Scenario Outline: Add a new service group
    Given I am on "hbac-service-groups" page
    When I click on "Add" button
    * I type in the field "Service group name" text "a_service1"
    * I type in the field "Description" text "my description"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New HBAC service group added"
    Then I should see "a_service1" entry in the data table
    * entry "a_service1" should have attribute "Description" set to "my description"

  Scenario Outline: Add several service group
    When I click on "Add" button
    * I type in the field "Service group name" text "a_service2"
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New HBAC service group added"
    * I type in the field "Service group name" text "a_service3"
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New HBAC service group added"
    Then I should see "a_service2" entry in the data table
    Then I should see "a_service3" entry in the data table

  Scenario Outline: Search for a service group
    When I type "a_service2" in the search field
    Then I should see the "a_service2" text in the search input field
    When I click on the arrow icon to perform search
    Then I should see the element "a_service2" in the table
    And I should not see the element "a_service1" in the table
    Then I click on the X icon to clear the search field
    When I click on the arrow icon to perform search
    Then I should see the element "a_service1" in the table

  Scenario: Delete a service group
    Given I should see partial "a_service1" entry in the data table
    When I select entry "a_service1" in the data table
    * I click on "Delete" button
    When I see "Remove HBAC service group" modal
    * I should see "a_service1" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "HBAC service groups removed"
    Then I should not see "a_service1" entry in the data table

  Scenario: Delete many service groups
    Given I should see "a_service2" entry in the data table
    Given I should see "a_service3" entry in the data table
    Then I select entry "a_service2" in the data table
    Then I select entry "a_service3" in the data table
    When I click on "Delete" button
    * I see "Remove HBAC service groups" modal
    * I should see "a_service2" entry in the data table
    * I should see "a_service3" entry in the data table
    * in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "HBAC service groups removed"
    Then I should not see "a_service2" entry in the data table
    Then I should not see "a_service3" entry in the data table

  Scenario: Cancel creation of a service group
    When I click on "Add" button
    * I type in the field "Service group name" text "a_service_cancel"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "a_service_cancel" entry in the data table
