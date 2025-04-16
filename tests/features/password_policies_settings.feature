Feature: Password policies - Settings page
  Modify password policies settings

  Background:
    Given I am logged in as "Administrator"

  Scenario: Prep: Create a new group
    Given I am on "user-groups" page
    When I click on "Add" button
    Then I see "Add user group" modal
    * I type in the field "Group name" text "my_user_group"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New user group added"
    * I close the alert
    Then I should see "my_user_group" entry in the data table

  Scenario: Prep: Add the group to password policies
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


  Scenario: Set max lifetime
    Given I am on "password-policies" page
    When I click on "my_user_group" entry in the data table
    Given I am on the "password-policies" > "my_user_group" Settings page
    When I type in the field with ID "krbmaxpwdlife" the text "120"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Set min lifetime
    When I type in the field with ID "krbminpwdlife" the text "24"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Set history size
    When I type in the field with ID "krbpwdhistorylength" the text "10"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Set character classes
    When I clear the field "krbpwdmindiffchars"
    And I type in the field with ID "krbpwdmindiffchars" the text "5"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Check that character classes values should be between 1 and 5
    When I clear the field "krbpwdmindiffchars"
    And I type in the field with ID "krbpwdmindiffchars" the text "6"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "danger" alert with text "invalid 'minclasses': can be at most 5"
    * I close the alert
    Then I click on "Revert" button
    * I should see "success" alert with text "Password policy data reverted"
    * I close the alert

  Scenario: Set min length
    When I clear the field "krbpwdminlength"
    And I type in the field with ID "krbpwdminlength" the text "3"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Set max failures
    When I clear the field "krbpwdmaxfailure"
    And I type in the field with ID "krbpwdmaxfailure" the text "7"
    Then I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Set failure reset interval
    When I type in the field with ID "krbpwdfailurecountinterval" the text "60"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Set lockout duration
    When I type in the field with ID "krbpwdlockoutduration" the text "120"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Set priority
    When I clear the field "cospriority"
    And I type in the field with ID "cospriority" the text "5"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Priority cannot be empty
    When I clear the field "cospriority"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "danger" alert with text "'cospriority' is required"
    * I close the alert
    Then I click on "Revert" button
    * I should see "success" alert with text "Password policy data reverted"
    * I close the alert

  Scenario: Set grace login limit
    When I clear the field "passwordgracelimit"
    When I type in the field with ID "passwordgracelimit" the text "2"
    Then button "Save" should be enabled
    When I click on "Save" button
    * I should see "success" alert with text "Password policy 'my_user_group' updated"
    * I close the alert

  Scenario: Cleanup: Delete the group
    Given I am on "user-groups" page
    Given I should see "my_user_group" entry in the data table
    Then I select entry "my_user_group" in the data table
    When I click on "Delete" button
    * I see "Remove user groups" modal
    * I should see "my_user_group" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "User groups removed"
    * I close the alert
    Then I should not see "my_user_group" entry in the data table


