Feature: Subordinate IDs manipulation
  Create subordinate IDs

  Background:
    Given I am logged in as "Administrator"
    Given I am on "subordinate-ids" page

  Scenario: Prep: Create new user
    Given I am on "active-users" page
    When I click on "Add" button
    * I type in the field "User login" text "testuser"
    * I type in the field "First name" text "Test"
    * I type in the field "Last name" text "User"
    And in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "New user added"
    When I close the alert
    Then I should see "testuser" entry in the data table


  Scenario: Add a new subordinate ID
    When I click on "Add" button
    And I click in the "Owner" selector field
    * I select "testuser" option in the "Owner" selector
    * in the modal dialog I click on "Add" button
    Then I should see "success" alert with text "Subordinate ID successfully added"
    When I close the alert
