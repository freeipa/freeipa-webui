Feature: Subordinate IDs - Settings page
  Modify Subodinate IDs settings

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

  # This test assumes that there are only one single subordinate ID in the table
  ## because we don't know the ID of the subordinate ID
  Scenario: Set 'Description' field
    Given I am on "subordinate-ids" page
    When I click on the first entry in the data table
    When I clear the field "description"
    When I type in the field with ID "description" the text "test_user"
    Then I click on "Save" button
    * I should see "success" alert
    * I close the alert

  Scenario: Cleanup: Delete user
    Given I am on "active-users" page
    When I select entry "testuser" in the data table
    When I click on "Delete" button
    * I see "Remove Active Users" modal
    * I should see "testuser" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Users removed"
    * I close the alert
    Then I should not see "testuser" entry in the data table
