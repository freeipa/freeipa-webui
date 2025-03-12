Feature: Password policies manipulation
  Create, delete password policies

  Background:
    Given I am logged in as "Administrator"
    Given I am on "password-policies" page

  Scenario: Add a new user group
    Given I am on "user-groups" page
    When I click on "Add" button
    Then I see "Add user group" modal
    * I type in the field "Group name" text "my_user_group"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    * I close the alert
    Then I should see "my_user_group" entry in the data table

  Scenario: Add another user group
    Given I am on "user-groups" page
    When I click on "Add" button
    Then I see "Add user group" modal
    * I type in the field "Group name" text "my_user_group2"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    * I close the alert
    Then I should see "my_user_group2" entry in the data table

  Scenario: Add a new policy
    Given I am on "password-policies" page
    When I click on "Add" button
    Then I see "Add password policy" modal
    * I click in the "Group" selector field
    * I select "my_user_group" option in the "Group" selector
    * I type in the field "Priority" text "12"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Password policy successfully added"
    * I close the alert
    Then I should see "my_user_group" entry in the data table with ID "password-policies-table"

  Scenario: Add operation fails when priority is already taken by other group
    Given I am on "password-policies" page
    When I click on "Add" button
    Then I see "Add password policy" modal
    * I click in the "Group" selector field
    * I select "my_user_group2" option in the "Group" selector
    * I type in the field "Priority" text "12"
    When in the modal dialog I click on "Add" button
    * I should see "danger" alert with text "invalid 'priority': priority must be a unique value (12 already used by my_user_group)"
    * I close the alert
    Then in the modal dialog I click on "Cancel" button

  Scenario: Delete policies
    Given I should see "my_user_group" entry in the data table with ID "password-policies-table"
    Then I select entry "my_user_group" in the data table
    When I click on "Delete" button
    * I see "Remove password policies" modal
    * I should see "my_user_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Password policies removed"
    * I close the alert
    Then I should not see "my_user_group" entry in the data table

  Scenario: Cleanup: Delete user groups
    Given I am on "user-groups" page
    Given I should see "my_user_group" entry in the data table
    Given I should see "my_user_group2" entry in the data table
    Then I select entry "my_user_group" in the data table
    * I select entry "my_user_group2" in the data table
    When I click on "Delete" button
    * I see "Remove user groups" modal
    * I should see "my_user_group" entry in the data table
    * I should see "my_user_group2" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "User groups removed"
    * I close the alert
    Then I should not see "my_user_group" entry in the data table
    And I should not see "my_user_group2" entry in the data table